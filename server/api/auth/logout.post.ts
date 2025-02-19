import {eventHandler} from "#imports";
import {LoginRequestSchema} from "#shared/dto";
import {prisma} from "$server/lib/db";
import {verifyPassword} from "$server/lib/auth-utils";

export default eventHandler(async event => {
    await requireUserSession(event);
    return clearUserSession(event);
})