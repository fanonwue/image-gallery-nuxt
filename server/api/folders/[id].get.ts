import {eventHandler} from "#imports";
import {prisma} from "$server/lib/db";
import {folderNotFoundError, folderUpdateForbiddenError, toDto} from "$server/lib/folder-utils";

import {GetFolderParams} from "#shared/dto";
import {requireUserId} from "$server/lib/auth-utils";

export default eventHandler(async event => {
    const params = await getValidatedRouterParams(event, GetFolderParams.parse)

    const res = await prisma.folder.findFirst({
        where: {
            id: params.id
        }
    })

    if (!res) throw folderNotFoundError(params.id)
    if (res.ownerId !== await requireUserId(event)) throw folderUpdateForbiddenError(params.id)

    return toDto(res)
})