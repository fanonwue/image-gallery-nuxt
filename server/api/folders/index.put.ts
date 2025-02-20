import {eventHandler} from "#imports";
import {Prisma} from "@prisma/client";
import {requireUserId} from "$server/lib/auth-utils";
import {prisma} from "$server/lib/db";
import {toDto} from "$server/lib/folder-utils";
import {NewFolderSchema} from "#shared/dto";

export default eventHandler(async event => {
    const body = await readValidatedBody(event, NewFolderSchema.parse)

    const res = await prisma.folder.create({
        data: {
            ownerId: await requireUserId(event),
            name: body.name,
            description: body.description
        }
    })

    return toDto(res)
})