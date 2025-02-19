import {eventHandler, createError, setResponseStatus} from "#imports";
import {prisma} from "~/server/lib/db";
import {currentUserId} from "#utils";
import {deleteImageFile} from "$server/api/images/image-operations";

export default eventHandler(async (event) => {
    const rawId = getRouterParam(event, "id")
    const id = rawId ? parseInt(rawId) : undefined
    if (!id || isNaN(id)) throw createError({ statusCode: 400, message: "No ID provided" })

    const image = await prisma.image.findFirst({
        where: {id: id},
        include: { meta: true }
    })

    if (!image) throw createError({ statusCode: 404, message: "Image not found" })
    if (image.ownerId !== currentUserId()) throw createError({ statusCode: 403, message: "You do not have permission to perform this action" })

    await prisma.$transaction(async (tx) => {
        await tx.image.delete({
            where: {id: id},
        })
        return deleteImageFile(id)
    })

    setResponseStatus(event, 200)
})