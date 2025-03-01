import {createError, eventHandler} from "#imports";
import type {ImageDto} from "~/shared/dto";
import {patchHandler} from "~/server/api/images/image-operations";

export default eventHandler(async (event): Promise<ImageDto> => {
    const rawId = getRouterParam(event, "id")
    const id = rawId ? parseInt(rawId) : undefined
    if (!id || isNaN(id)) throw createError({statusCode: 400, message: "No ID provided"})

    return patchHandler(event, id)
})