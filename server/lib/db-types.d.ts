import { Prisma } from "@prisma/client";

export type ImageWithMeta = Prisma.ImageGetPayload<{
    include: { meta: true }
}>

export type UpdateImagePayload = Partial<Prisma.ImageCreateWithoutOwnerInput & { ownerId: string }>