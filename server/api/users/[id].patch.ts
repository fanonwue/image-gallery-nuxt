import {eventHandler, readValidatedBody} from "#imports";
import {UpdateUserSchema} from "#shared/dto";
import {requireUserId, toDto, updateSessionWithUser, updateUser} from "$server/lib/auth-utils";
import {z} from "zod";

export default eventHandler(async (event) => {
    const routeParams = await getValidatedRouterParams(event, z.object({
        id: z.string()
    }).parse);

    const currentUserId = await requireUserId(event)

    if (routeParams.id !== currentUserId) throw createError({ status: 403, message: "You are not allowed to update this user" })

    const body = await readValidatedBody(event, UpdateUserSchema.parse)

    const updatedUser = await updateUser(routeParams.id, body)
    const dto = toDto(updatedUser)
    if (updatedUser.id === currentUserId) {
        await updateSessionWithUser(event, dto)
    }
    return dto;
})