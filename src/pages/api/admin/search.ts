import { PrismaClient } from "@/generated/prisma";
import { File } from "@/helpers/global";
import { jwtVerify } from "@/helpers/jwt";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, resp: NextApiResponse) {
    const payload = await jwtVerify(req.cookies.token ?? "");
    if (payload === null || payload.id !== process.env.ADMIN_ID) return resp.status(403).json({"message": "access denied"});
    const userId: string = payload.id as string;

    const { type, target } = req.body;

    const userSearch = async () => {
        const userResult = await prisma.user.findUnique({
            where: {
                id: target,
            },
        });
        if (userResult === null) return resp.status(200).json({"message": "user not found"});
        
        const fileResult = await prisma.file.findMany({
            where: {
                createdBy: {
                    id: target
                },
            },
        });

        const parsedFileResults: File[] = [];
        fileResult.forEach(x => parsedFileResults.push({
            id: x.id,
            created: x.created,
            fileName: x.fileName
        }));

        resp.status(200).json({
            "message": "user found",
            "files": parsedFileResults,
        });
    };

    const fileSearch = async () => {
        const result = await prisma.file.findUnique({
            where: {
                id: target,
            },
        });
        if (result === null) return resp.status(200).json({"message": "file not found"});
        return resp.status(200).json({
            "createdby": result.userId,
        });
    }

    try {
        switch(type) {
            case "user":
                await userSearch();
                break;
            case "file":
                await fileSearch();
                break;
        }
    }catch(e: any) {
        if (process.env.DEBUG === "true") {
            resp.status(500).json({"message": e.message});
            return;
        }
        resp.status(500).json({"message": "internal server error"});
    }
}