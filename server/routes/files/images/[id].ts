import {createError, eventHandler, sendStream} from "#imports";
import {prisma} from "~/server/lib/db";
import {imageFilePath, toExternalId} from "~/server/lib/image-utils";
import {stat} from "node:fs/promises";
import {createReadStream} from "node:fs";
import mime from "mime";
import type {ImageFormat, ImageVariant} from "#shared/dto";
import {thumbnailFormats} from "#shared/dto";
import {calculateEtag} from "#utils/server";

export default eventHandler(async (event) => {
    const rawId = getRouterParam(event, "id")
    const id = rawId ? parseInt(rawId) : undefined
    if (!id || isNaN(id)) throw createError({statusCode: 400, message: "No ID provided"})

    const query = getQuery(event)

    const key = query.key as string;
    if (!key) throw createError({statusCode: 400, message: "No key provided"})

    const image = await prisma.image.findFirst({
        where: { id: id },
        select: {
            id: true,
            externalId: true,
            title: true,
            mimeType: true
        }
    })

    if (image == undefined) throw createError({ status: 404, message: "Image not found" })

    if (toExternalId(image.externalId) !== key)
        throw createError({ status: 403, message: "Invalid key" })

    let variant = query.variant as ImageVariant|undefined
    switch (variant) {
        case 'thumbnail':
            break
        default:
            variant = 'original'
    }

    let format = query.format as ImageFormat|undefined
    if (!format || !thumbnailFormats.includes(format)) format = undefined

    const filePath = imageFilePath(image.id, variant, format)
    let contentType = image.mimeType
    // If a non-original variant is requested, we need to determine the actual content type by its file name
    if (variant != 'original') {
        contentType = mime.getType(filePath) ?? contentType
    }

    try {
        const fileStat = await stat(filePath)
        const etag = calculateEtag(`${fileStat.mtime.toISOString()}__${fileStat.size}`)
        const readStream = createReadStream(filePath)
        const fileName = `${image.title}.${mime.getExtension(contentType)}`

        setResponseStatus(event, 200)
        setResponseHeaders(event,{
            "Content-Size": fileStat.size,
            "Content-Type": contentType,
            "Content-Disposition": `inline; filename=${fileName}`,
            "ETag": `"${etag}"`,
            "Cache-Control": "max-age=86400, public, must-revalidate"
        })

        return sendStream(event, readStream)
    } catch (e: any) {
        if (e?.code === "ENOENT") throw createError({status: 404, message: "File not found. If a thumbnail has been requested, it might not be available yet."})
        throw createError({ statusCode: 500, message: "Error occurred while writing response: " + e , cause: e})
    }
})