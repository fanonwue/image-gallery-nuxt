import {eventHandler, createError} from "#imports";
import {prisma} from "~/server/lib/db";
import type {ImageDto} from "#shared/dto";
import {toDto} from "~/server/lib/image-utils";

export default eventHandler(async (event): Promise<ImageDto> => {
    const rawId = getRouterParam(event, "id")
    const id = rawId ? parseInt(rawId) : undefined
    if (!id || isNaN(id)) throw createError({ statusCode: 400, message: "No ID provided" })

    const image = await prisma.image.findFirst({
        where: {id: id},
        include: { meta: true }
    })

    if (!image) throw createError({ statusCode: 404, message: "Image not found" })

    return toDto(image)
})