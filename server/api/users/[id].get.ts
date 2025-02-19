import {eventHandler, readValidatedBody} from "#imports";
import {z} from "zod";
import {prisma} from "$server/lib/db";
import {toDto} from "$server/lib/auth-utils";

export default eventHandler(async (event) => {
    const routeParams = await getValidatedRouterParams(event, z.object({
        id: z.string()
    }).parse);
    const user = await prisma.user.findFirst({
        where: {id: routeParams.id},
    });
    if (!user) throw createError({ statusCode: 404, message: "User not found" });
    return toDto(user);
})