import { PrismaClient } from "@/generated/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

interface StrippedFile {
    id: string,
    created: Date,
    fileName: string,
}

export default async function handler(req: NextApiRequest, resp: NextApiResponse) {
    const { page } = req.body;
    const perPage: number = parseInt(process.env.MAX_RESULTS_PER_PAGE ?? "10");
    const maxPages = Math.ceil(((await prisma.file.count())+1)/perPage);
    const result = await prisma.file.findMany({
        orderBy: {
            created: 'desc',
        },
        skip: Math.abs(parseInt(page) * perPage),
        take: perPage,
    });
    const strippedResults: StrippedFile[] = [];
    result.forEach(x => {
        strippedResults.push({
            id: x.id,
            created: x.created,
            fileName: x.fileName,
        });
    });
    resp.status(200).json({
        "files": strippedResults,
        "maxpages": maxPages,
    });
}