import { Prisma } from "@prisma/client";

export type ImageWithMeta = Prisma.ImageGetPayload<{
    include: { meta: true }
}>

export type ImageWithMetaAndFolders = Prisma.ImageGetPayload<{
    include: {
        meta: true,
        folders: true
    }
}>
export type ImageWithMetaAndFoldersDeep = Prisma.ImageGetPayload<{
    include: {
        meta: true,
        folders: {
            include: {
                folder: true
            }
        }
    }
}>

export type UpdateImagePayload = Partial<Prisma.ImageCreateWithoutOwnerInput & { ownerId: string }>