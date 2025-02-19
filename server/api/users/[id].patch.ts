import {eventHandler, readValidatedBody} from "#imports";
import {UpdateUserSchema} from "#shared/dto";
import {requireUserId, toDto, updateUser} from "$server/lib/auth-utils";
import {z} from "zod";

export default eventHandler(async (event) => {
    const routeParams = await getValidatedRouterParams(event, z.object({
        id: z.string()
    }).parse);

    if (routeParams.id !== await requireUserId(event)) throw createError({ status: 403, message: "You are not allowed to update this user" })

    const body = await readValidatedBody(event, UpdateUserSchema.parse)

    return toDto(await updateUser(routeParams.id, body));
})