import {imageFilePath} from "$server/lib/image-utils";
import {default as sharp, ResizeOptions} from "sharp";
import {createReadStream} from "node:fs";
import type {ImageVariant, ImageFormat} from "#shared/dto";
import {thumbnailFormats} from "#shared/dto";
import {prisma} from "$server/lib/db";
import {stat} from "node:fs/promises";

export interface ImageFileMetadata {
    variant: ImageVariant;
    width: number;
    height: number;
    format: ImageFormat;
}
export interface ImageProcessResult {
    original: ImageFileMetadata;
    thumbnails: ImageFileMetadata[];
}

export const maxDimension = 1000
export const quality = 85

export const processImage = async (imageId: number): Promise<ImageProcessResult> => {
    const originalPath = imageFilePath(imageId, "original")
    const sharpInstance = sharp()
    createReadStream(originalPath).pipe(sharpInstance)

    const { width: originalWidth, height: originalHeight, format: originalFormat } = await sharpInstance.metadata()
    if (!originalWidth) throw new Error('Image width is undefined')
    if (!originalHeight) throw new Error('Image height is undefined')
    if (!originalFormat) throw new Error('Image format is undefined')
    const heightLimited = (originalHeight ?? 0) > (originalWidth ?? 0)

    const processingPromises: Promise<ImageFileMetadata>[] = thumbnailFormats.map(async (format) => {
        const thumbnailPath = imageFilePath(imageId, "thumbnail", format)
        const resizeOptions: ResizeOptions = {
            height: heightLimited ? maxDimension : undefined,
            width: heightLimited ? undefined : maxDimension,
            withoutEnlargement: true
        }

        const { width, height } = await sharpInstance.clone()
            .resize(resizeOptions)
            .toFormat(format, { quality: quality })
            .toFile(thumbnailPath)

        return <ImageFileMetadata>{
            format, width, height, variant: 'thumbnail'
        }
    })


    return {
        original: {
            variant: "original",
            width: originalWidth,
            height: originalHeight,
            format: originalFormat,
        },
        thumbnails: await Promise.all(processingPromises)
    }
}

const asyncEvery = async (array: any, predicate: any) => {
    for (let e of array) {
        if (await predicate(e)) return true;
    }
    return false;
}
export const createMissingThumbnails = async (asyncProcessing: boolean = false): Promise<Map<number, ImageProcessResult>> => {
    const images = await prisma.image.findMany({
        select: { id: true }
    })

    const missingThumbnailsPromises = images.map(image => image.id)
        .map(async (id) => {
            const thumbnailPaths =
                thumbnailFormats.map(format => imageFilePath(id, "thumbnail", format))

            const thumbnailsExist = await asyncEvery(thumbnailPaths, async (path: string) => {
                try {
                    const statResult = await stat(path)
                    return statResult.size > 0
                } catch (error: any) {
                    if ("code" in error && error.code === "ENOENT") {
                        // No op
                    } else {
                        console.error(`Unknown error while testing for '${path}':`, error)

                    }
                    return false
                }
            })

            if (!thumbnailsExist) return id
            return undefined
        })

    const missingThumbnails = (await Promise.all(missingThumbnailsPromises))
        .filter(id => id !== undefined)

    const processPromises: Promise<{imageId: number, result: ImageProcessResult}>[] = []

    for (const id of missingThumbnails) {
        const promise = processImage(id)
            .then(result => ({imageId: id, result}))
        if (!asyncProcessing) await promise
        processPromises.push(promise)

    }

    const results = await Promise.all(processPromises)
    return new Map(results.map(result => [result.imageId, result.result]))
}