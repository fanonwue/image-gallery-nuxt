import {imageFilePath} from "$server/lib/image-utils";
import {default as sharp, ResizeOptions} from "sharp";
import {createReadStream} from "node:fs";
import type {ImageVariant, ImageFormat} from "#shared/dto";
import {thumbnailFormats} from "#shared/dto";
import {form} from "@primevue/metadata";

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