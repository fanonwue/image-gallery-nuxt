import {prisma} from "$server/lib/db";
import {hashPassword, verifyPassword as verifyPasswordActual, createError} from "#imports";
import type {UpdateUserDto, UserDto} from "#shared/dto";
import {Prisma} from "@prisma/client";
import {EventHandlerRequest, H3Event} from "h3";

export const updateUser = async (userId: string, userDto: UpdateUserDto): Promise<Prisma.UserGetPayload<any>> => {
    const updateData: Prisma.UserUpdateInput = {}
    if (userDto.email) updateData.email = userDto.email;
    if (userDto.password) updateData.password = await hashPassword(userDto.password);
    if (userDto.username) updateData.username = userDto.username;

    try {
        return await prisma.user.update({
            where: {id: userId},
            data: updateData,
        })
    } catch (error: unknown) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025")
            throw createError({ statusCode: 404, message: "Could not update: user not found" });
        throw error
    }
}

export const verifyPasswordUser = async (userId: string, password: string): Promise<boolean> => {
    const user = await prisma.user.findFirst({where: {id: userId}})
    if (!user) return false
    return verifyPassword(user.password, password)
}

export const requireUserId = async (event: H3Event<EventHandlerRequest>): Promise<string> => {
    const session = await requireUserSession(event)
    return session.user.id
}

export const isUser = async (event: H3Event<EventHandlerRequest>, userId: string): Promise<boolean> => {
    const { user } = await getUserSession(event)
    if (!user) return false
    return user.id !== userId
}

export const verifyPassword = (hashed: string, password: string): Promise<boolean> => {
    return verifyPasswordActual(hashed, password)
}

export const toDto = (user: Prisma.UserGetPayload<any>): UserDto => {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
    }
}

export const updateSessionWithUser = (event: H3Event, user: UserDto) => setUserSession(event, {
    user: {
        id: user.id,
        email: user.email,
        username: user.username
    },
    loggedInAt: new Date()
})