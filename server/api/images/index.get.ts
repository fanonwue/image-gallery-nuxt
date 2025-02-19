import {clampPageSize, currentUserId, defaultPageSize, queryParamToNumber} from "#utils";
import {prisma} from "~/server/lib/db";
import {Prisma} from "@prisma/client";
import {FolderDto, GetImageQuery, GetImageQuerySchema, ImageDto, QueryResult} from "~/shared/dto";
import {toDto} from "~/server/lib/image-utils";
import {eventHandler, getValidatedQuery} from "#imports";
import {requireUserId} from "$server/lib/auth-utils";

export default eventHandler(async event => {
    const query = await getValidatedQuery(event, GetImageQuerySchema.parse)

    const page = getPage(query)
    const pageSize = getPageSize(query)
    const folders = getFolders(query)

    const offset = (page - 1) * pageSize

    const where: Prisma.ImageWhereInput = {
        ownerId: await requireUserId(event),
    }

    if (folders.length > 0) {
        where.folders = {
            some: {
                folderId: {
                    in: folders
                }
            }
        }
    }


    const totalCount = await prisma.image.count({
        where: where
    })

    const res = await prisma.image.findMany({
        where: where,
        take: pageSize,
        skip: offset,
        include: {
            meta: true
        },
        orderBy: { id: "desc" }
    })

    return <QueryResult<ImageDto>>{
        items: res.map(i => toDto(i)),
        totalCount,
        page,
        pageSize,
        offset
    }
})

const getPage = (params: GetImageQuery): number => queryParamToNumber(params.page, 1)

const getPageSize = (params: GetImageQuery) => {
    const pageSize = queryParamToNumber(params.pageSize, defaultPageSize)
    return clampPageSize(pageSize)
}

const getFolders = (params: GetImageQuery): FolderDto['id'][] => {
    const rawValues = params.folders
    if (typeof rawValues != 'string') return []
    return rawValues.split(',').map(value => parseInt(value.trim())).filter(value => value && !isNaN(value))
}