import {Folder} from "@prisma/client";
import {FolderDto} from "#shared/dto";
import {prisma} from "$server/lib/db";

export const toDto = (folder: Folder): FolderDto => {
    return {
        id: folder.id,
        name: folder.name,
        description: folder.description,
        ownerId: folder.ownerId
    }
}

export const folderNotFoundError = (id: number) => createError({ status: 404, message: `Folder ${id} not found` })
export const folderUpdateForbiddenError = (id: number) => createError({ status: 403, message: `You are not allowed to update or delete folder ${id}` })
export const assertCanUpdateFolder = async (id: number, currentUserId: string) => {
    const folder = await prisma.folder.findFirst({
        where: { id: id },
        select: { ownerId: true }
    })

    if (!folder) throw folderNotFoundError(id)
    if (folder.ownerId !== currentUserId) throw folderUpdateForbiddenError(id)
}