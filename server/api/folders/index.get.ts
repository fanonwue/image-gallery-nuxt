import {eventHandler} from "#imports";
import {Prisma} from "@prisma/client";
import {currentUserId} from "#utils";
import {prisma} from "$server/lib/db";
import {toDto} from "$server/lib/folder-utils";
import {requireUserId} from "$server/lib/auth-utils";

export default eventHandler(async event => {
    const where: Prisma.FolderWhereInput = {
        ownerId: await requireUserId(event)
    }

    const res = await prisma.folder.findMany({
        where: where,
        orderBy: { name: "asc" }
    })

    // SQLite does not support case-insensitive sorting, so we just sort it again I guess
    res.sort((a, b) => a.name.localeCompare(b.name))

    return res.map(f => toDto(f))
})