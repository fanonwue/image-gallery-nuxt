import {eventHandler} from "#imports";
import {Prisma} from "@prisma/client";
import {requireUserId} from "$server/lib/auth-utils";
import {prisma} from "$server/lib/db";
import {assertCanUpdateFolder, toDto} from "$server/lib/folder-utils";
import {z} from "zod";
import {FolderDataSchema, FolderId, GetFolderParams, NewFolderSchema} from "#shared/dto";

export default eventHandler(async event => {
    const params = await getValidatedRouterParams(event, GetFolderParams.parse)

    await assertCanUpdateFolder(params.id, await requireUserId(event));

    await prisma.folder.delete({
        where: {
            id: params.id
        }
    })
})