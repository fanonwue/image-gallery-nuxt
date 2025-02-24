import {eventHandler} from "#imports";
import {prisma} from "$server/lib/db";
import {updateSessionWithUser, verifyPassword, toDto} from "$server/lib/auth-utils";
import {LoginRequestSchema} from "#shared/dto";

export default eventHandler(async event => {
    const loginRequest = await readValidatedBody(event, LoginRequestSchema.parse)

    const user = await prisma.user.findFirst({
        where: {
            AND: [
                { OR: [{ email: loginRequest.identifier }, { username: loginRequest.identifier }] },
                { active: true }
            ]
        }
    })

    if (!user || !user.active) throw loginError
    const passwordVerified = await verifyPassword(user.password, loginRequest.password)
    if (!passwordVerified) throw loginError
    return updateSessionWithUser(event, toDto(user))
})

const loginError = createError({ status: 401, message: "Invalid credentials" })