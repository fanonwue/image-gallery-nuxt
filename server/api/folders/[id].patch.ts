import {eventHandler} from "#imports";
import {Prisma} from "@prisma/client";
import {requireUserId} from "$server/lib/auth-utils";
import {prisma} from "$server/lib/db";
import {assertCanUpdateFolder, folderNotFoundError, toDto} from "$server/lib/folder-utils";
import {z} from "zod";
import {FolderDataSchema, FolderId, GetFolderParams, NewFolderSchema} from "#shared/dto";

export default eventHandler(async event => {
    const params = await getValidatedRouterParams(event, GetFolderParams.parse)
    const body = await readValidatedBody(event, FolderDataSchema.parse)

    await assertCanUpdateFolder(params.id, await requireUserId(event));

    const res = await prisma.folder.update({
        where: {
            id: params.id,
        },
        data: {
            name: body.name,
            description: body.description
        }
    })

    return toDto(res)
})