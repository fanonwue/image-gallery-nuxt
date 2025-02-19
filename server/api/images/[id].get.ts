import {eventHandler, createError, getValidatedQuery, getUserSession} from "#imports";
import {prisma} from "~/server/lib/db";
import type {ImageDto} from "#shared/dto";
import {toDto} from "~/server/lib/image-utils";
import {z} from "zod";
import {requireUserId} from "$server/lib/auth-utils";

export default eventHandler(async (event): Promise<ImageDto> => {
    const rawId = getRouterParam(event, "id")
    const id = rawId ? parseInt(rawId) : undefined
    if (!id || isNaN(id)) throw createError({ statusCode: 400, message: "No ID provided" })
    const currentUserId = await requireUserId(event)

    const query = await getValidatedQuery(event, z.object({
        withFolder: z.boolean({ coerce: true }).optional(),
    }).parse)

    const withFolder = query.withFolder === true

    const image = await prisma.image.findFirst({
        where: {id: id},
        include: {
            meta: true,
            folders: {
                include: {
                    folder: withFolder,
                }
            }
        }
    })

    if (!image) throw createError({ statusCode: 404, message: "Image not found" })
    if (image.ownerId != currentUserId) throw createError({ statusCode: 403, message: "You are not allowed to access this image" })

    return toDto(image)
})