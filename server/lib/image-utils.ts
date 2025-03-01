import crypto from 'node:crypto'
import type {FolderDto, ImageDto, ImageFormat, ImageVariant} from "#shared/dto";
import type {ImageMeta} from "@prisma/client";
import {
    UpdateImagePayload,
    ImageWithMeta,
    ImageWithMetaAndFolders,
    ImageWithMetaAndFoldersDeep
} from "~/server/lib/db-types";
import {defaultThumbnailFormat} from "#shared/dto";
import { toDto as toFolderDto } from "~/server/lib/folder-utils";
import {Prisma} from "@prisma/client";
import {bytesToBase64, randomBytes} from "#utils/server";

const externalIdLength = 32

export const toExternalId = (buf: Buffer|Uint8Array|undefined = undefined) => {
    if (!buf) buf = generateExternalId()
    return bytesToBase64(buf, true)
}

export const generateExternalId = () => randomBytes(externalIdLength)

export const imageBasePath = (variant: ImageVariant) => {
    let variantPath = 'originals'
    if (variant == 'thumbnail')
        variantPath = 'thumbnails'

    return `./data/images/${variantPath}/`
}

export const imageFilePath = (imageId: number, variant: ImageVariant = 'original', format?: ImageFormat|undefined) => {
    const basePath = imageBasePath(variant)
    let fileSuffix = ''
    if (variant == 'thumbnail')
        fileSuffix = `.${format ?? defaultThumbnailFormat}`

    return `${basePath}${imageId}${fileSuffix}`
}
export const imageUrl = (image: ImageDto, variant: ImageVariant = 'original') => {
    // Adding the timestamp causes cached images to be invalidated because the URL changes
    const ts = Date.parse(image.updatedAt ?? Date.now().toString())
    return `/files/images/${image.id}?key=${image.externalId}&variant=${variant}&ts=${ts}`
}

export const toDto = (image: ImageWithMeta|ImageWithMetaAndFolders|ImageWithMetaAndFoldersDeep): ImageDto => {
    const dto: ImageDto = {
        id: image.id,
        externalId: toExternalId(image.externalId),
        description: image.description,
        title: image.title,
        mimeType: image.mimeType,
        createdAt: image.createdAt.toISOString(),
        updatedAt: image.updatedAt.toISOString(),
        ownerId: image.ownerId
    }

    if (image.meta) {
        const meta: Record<string, string> = {}
        image.meta?.forEach((m: ImageMeta) => meta[m.name] = m.value)
        dto.meta = meta
    }

    if ('folders' in image) {
        const folderIds = image.folders.map(f => f.folderId).filter(f => f)
        const folders: FolderDto[] = []
        image.folders.forEach(f => {
            if (!('folder' in f)) return
            folders.push(toFolderDto(f.folder as Prisma.FolderGetPayload<any>))
        })
        dto.folderIds = folderIds
        dto.folders = folderIds.length == folders.length ? folders : undefined
    }

    dto.originalUrl = imageUrl(dto, 'original')
    dto.thumbnailUrl = imageUrl(dto, 'thumbnail')
    return dto
}

export const metaFromDto = (image: ImageDto): ImageMeta[]|undefined => {
    if (!image.meta) return undefined
    return Object.entries(image.meta).map(([name, value]) => <ImageMeta>{ name, value })
}

export const addMetaIfExists = (data: UpdateImagePayload, dto?: ImageDto): UpdateImagePayload => {
    if (!dto) return data
    const meta = metaFromDto(dto)
    if (meta) data.meta = {
        create: meta
    }
    return data
}