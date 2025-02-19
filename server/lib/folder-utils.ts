import {Folder} from "@prisma/client";
import {FolderDto} from "#shared/dto";

export const toDto = (folder: Folder): FolderDto => {
    return {
        id: folder.id,
        name: folder.name,
        description: folder.description,
        ownerId: folder.ownerId
    }
}