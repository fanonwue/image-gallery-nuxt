import {createError, eventHandler, readMultipartFormData} from "#imports";
import {ImageDto, NewImageSchema, parseJson} from "~/shared/dto";
import {addMetaIfExists, generateExternalId, imageFilePath, toDto} from "~/server/lib/image-utils";
import {prisma} from "~/server/lib/db";
import {Image, Prisma} from "@prisma/client";
import {user} from "#utils";
import mime from "mime";
import {imageUpdateRequestMultipart, isAcceptedMimeType, saveFile} from "~/server/api/images/image-operations";
import {mimeTypeFromMultipartFile} from "#utils/server";
import {processImage} from "$server/lib/thumbnail";

export default eventHandler(async (event): Promise<ImageDto> => {
    const { imageMetaRaw, file } = await imageUpdateRequestMultipart(event);
    if (!imageMetaRaw) throw createError({ statusCode: 400, message: "No metadata submitted" })

    if (!file) throw createError({ statusCode: 400, message: "No file submitted" })

    const imageMeta = parseJson(NewImageSchema).parse(imageMetaRaw)
    const mimeType = mimeTypeFromMultipartFile(file)
    if (!isAcceptedMimeType(mimeType)) throw createError({ statusCode: 400, message: "Illegal file type" })

    const data: Prisma.ImageUncheckedCreateInput = {
        title: imageMeta.title ?? "",
        description: imageMeta.description ?? "",
        ownerId: user,
        externalId: generateExternalId(),
        mimeType: mimeType
    }

    addMetaIfExists(data, imageMeta as ImageDto)

    const image = await prisma.$transaction(async (tx) => {
        const image = await tx.image.create({
            data: data,
            include: {
                meta: true
            }
        })

        await saveFile(image, file.data)
        return image
    })

    await processImage(image.id)

    return toDto(image)
})