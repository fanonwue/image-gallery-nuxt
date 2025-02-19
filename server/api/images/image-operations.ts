import {
    type ImageDto,
    parseJson,
    UpdateImagePayloadDto,
    UpdateImageSchema,
    UpdateImageSchemaWithId
} from "~/shared/dto";
import {createError, getRequestHeader, readMultipartFormData} from "#imports";
import {ImageWithMeta, ImageWithMetaAndFolders, UpdateImagePayload} from "~/server/lib/db-types";
import {addMetaIfExists, imageFilePath, toDto} from "~/server/lib/image-utils";
import {prisma} from "~/server/lib/db";
import {Image, Prisma, PrismaClient} from "@prisma/client";
import {Readable} from "node:stream";
import {rm} from "node:fs/promises";
import {createWriteStream} from "node:fs";
import {H3Event, MultiPartData} from "h3";
import { z } from "zod";
import {processImage} from "$server/lib/thumbnail";
import {mimeTypeFromMultipartFile} from "#utils/server";
import {acceptedFileTypes} from "#shared";
import {requireUserId} from "$server/lib/auth-utils";

interface UpdateRequest {
    imageMetaRaw?: string;
    file?: MultiPartData
}

type PreUpdateTransactionCallback = (tx: PrismaClient, updateData: UpdateImagePayload) => Promise<unknown>
type PostUpdateTransactionCallback = (tx: PrismaClient, image: ImageWithMeta) => Promise<unknown>

export const imageUpdateRequest = async (event: H3Event): Promise<UpdateRequest> => {
    const body = await readBody(event);
    if (!body) throw createError({statusCode: 400, message: "No update data"})

    return {
        imageMetaRaw: body
    };
}

export const imageUpdateRequestMultipart = async (event: H3Event): Promise<UpdateRequest> => {
    const parts = await readMultipartFormData(event)

    const imageMetaRaw: MultiPartData|undefined = parts?.find(p => p.name === "meta")


    const file: MultiPartData|undefined = parts?.find(p => p.name === "file")
    if (!file) throw createError({ statusCode: 400, message: "No file submitted" })

    return {
        imageMetaRaw: imageMetaRaw?.data?.toString("utf-8"),
        file
    }
}

export const patchHandler = async (event: H3Event, idFromRoute: number|undefined = undefined) => {
    const currentUserId = await requireUserId(event)
    const contentType = getRequestHeader(event, "Content-Type")?.split(';')[0]

    let updateRequest: UpdateRequest|undefined;

    switch (contentType) {
        case 'multipart/form-data':
            updateRequest = await imageUpdateRequestMultipart(event)
            break
        default:
            updateRequest = await imageUpdateRequest(event)
    }

    const body = z.optional(parseJson(UpdateImageSchema)).parse(updateRequest.imageMetaRaw)

    const id = idFromRoute === undefined ? body?.id : idFromRoute;
    if (!id) throw createError({statusCode: 400, message: "No ID provided"})

    const imageOwner = await prisma.image.findFirst({
        where: { id: id },
        select: { ownerId: true }
    })

    if (!imageOwner) throw imageNotFound(id)
    if (imageOwner.ownerId !== currentUserId)
        throw createError({statusCode: 403, message: "You are not allowed to update this image"})

    const image = await updateImage(id, body, updateRequest.file, undefined, async (_, image) => {
        if (updateRequest.file) {
            await saveFile(image, updateRequest.file.data)
        }
    })

    if (updateRequest.file) await processImage(image.id)

    return toDto(image)
}

export const updateImage = async (
    id: number,
    body?: UpdateImagePayloadDto|string,
    file?: MultiPartData,
    preUpdateCallback?: PreUpdateTransactionCallback,
    postUpdateCallback?: PostUpdateTransactionCallback,
): Promise<ImageWithMetaAndFolders> => {
    if (!body && !file) throw createError({ statusCode: 400, message: "no update data or file provided" })
    if (typeof body === "string") body = z.optional(parseJson(UpdateImageSchema)).parse(body)

    const updateData: UpdateImagePayload = {}
    if (body?.title) updateData.title = body.title
    if (body?.description) updateData.description = body.description
    if (body?.folderIds) updateData.folders = {

    }
    if (file) {
        const mimeType = mimeTypeFromMultipartFile(file)
        if (!isAcceptedMimeType(mimeType)) throw createError({ statusCode: 400, message: "Illegal file type" })
        updateData.mimeType = mimeType
    }

    addMetaIfExists(updateData, body as ImageDto|undefined)

    return prisma.$transaction(async (tx) => {
        if (preUpdateCallback) await preUpdateCallback(tx as PrismaClient, updateData)

        if (updateData.meta) {
            await tx.imageMeta.deleteMany({
                where: { imageId: id }
            })
        }

        const updatedImage = await tx.image.update({
            where: { id },
            data: updateData,
            include: {
                meta: true
            }
        })

        if (body?.folderIds) {
            await tx.imagesInFolders.deleteMany({
                where: {
                    imageId: id,
                    folderId: {
                        notIn: body.folderIds
                    }
                }
            })

            const existingAssignments = (await tx.imagesInFolders.findMany({
                where: { imageId: id }
            })).map(assignment => assignment.folderId)
            const newAssignments = body.folderIds.filter(folderId => !existingAssignments.includes(folderId)).map(folderId => ({
                imageId: id,
                folderId: folderId
            }))

            await tx.imagesInFolders.createMany({
                data: newAssignments
            })
        }

        if (postUpdateCallback) await postUpdateCallback(tx as PrismaClient, updatedImage)
        const finalImage = tx.image.findFirst({
            where: {id: id},
            include: {
                meta: true,
                folders: true
            }
        })
        return finalImage as Promise<ImageWithMetaAndFolders>
    }).catch((e: Prisma.PrismaClientKnownRequestError) => {
        if (e.code === "P2025") throw imageNotFound(id)
        throw e
    });
}

export const isAcceptedMimeType = (mimeType: string) => {
    return acceptedFileTypes.includes(mimeType)
}

export const fetchImage = async (id: number): Promise<ImageWithMeta> => {
    const image = await prisma.image.findFirst({
        where: { id },
        include: {
            meta: true
        }
    }).catch((e: Prisma.PrismaClientKnownRequestError) => {
        if (e.code === "P2025") return undefined
        throw e
    })

    if (!image) throw imageNotFound(id)

    return image
}

export const deleteImageFile = async (imageId: Image['id']): Promise<unknown> => {
    const paths = [
        imageFilePath(imageId, 'original'),
        imageFilePath(imageId, 'thumbnail')
    ]

    return Promise.all(paths.map(path => rm(path)))
}

export const saveFile = async (image: Image, file: Buffer|Readable): Promise<string> => {
    if (Buffer.isBuffer(file)) file = Readable.from(file)
    const stream: Readable = file
    const filePath = imageFilePath(image.id, 'original')
    const writeStream = createWriteStream(filePath)

    await new Promise<void>((resolve, reject) => {
        stream
            .pipe(writeStream)
            .on('finish', resolve)
            .on('error', reject)
    })

    return filePath
}

const imageNotFound = (id: number) => createError({ statusCode: 404, message: `No image with ID ${id} found` })