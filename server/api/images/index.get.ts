import {clampPageSize, defaultPageSize, queryParamToNumber, user} from "#utils";
import {prisma} from "~/server/lib/db";
import {Prisma} from "@prisma/client";
import {GetImageQuery, ImageDto, QueryResult} from "~/shared/dto";
import {toDto} from "~/server/lib/image-utils";
import {eventHandler} from "#imports";
export default eventHandler(async event => {
    const query: GetImageQuery = getQuery(event)

    const page = getPage(query)
    const pageSize = getPageSize(query)

    const offset = (page - 1) * pageSize

    const where: Prisma.ImageWhereInput = {}
    where.ownerId = user

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