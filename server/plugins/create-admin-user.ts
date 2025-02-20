import {prisma} from "$server/lib/db";

export default defineNitroPlugin(async (nitroApp) => {
    const adminUsername = process.env.ADMIN_USER ?? "admin"
    const adminPassword = process.env.ADMIN_PASS ?? "CHANGE_ME"

    const adminUserId = (await prisma.user.findFirst({
            where: { username: adminUsername },
            select: { id: true }
        })
    )?.id

    if (!adminUserId) {
        console.log("Creating admin user:", adminUsername)
        const user = await prisma.user.create({
            data: {
                username: adminUsername,
                email: "admin@example.com",
                password: await hashPassword(adminPassword),
            }
        })
        console.log("Created:", user)
    }
})