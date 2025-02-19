import {PrismaClient} from "@prisma/client";
import {enableQueryLogging} from "#utils/server";


export const prisma = new PrismaClient({
    log: [
        {
            emit: "event",
            level: "query",
        },
    ]
})

if (enableQueryLogging)
    prisma.$on("query", async (e) => {
        console.log(`${e.query} ${e.params}`)
    });