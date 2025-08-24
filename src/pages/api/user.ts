import { PrismaClient } from "@/generated/prisma";
import { jwtVerify } from "@/helpers/jwt";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, resp: NextApiResponse) {
    const payload = await jwtVerify(req.cookies.token ?? "");
    if (payload === null) return resp.status(403).json({"message": "access denied"});
    const userId: string = payload.id as string;

    const deleteHandler = async () => {
        await prisma.file.deleteMany({
            where: {
                createdBy: {
                    id: userId,
                },
            },
        });
        await prisma.user.delete({
            where: {
                id: userId,
            },
        });
        resp.status(200).json({"message": "account deleted"});
    }

    try {
        switch (req.method) {
            case "DELETE":
                deleteHandler();
                break;
        }
    }catch(e: any) {
        if (process.env.DEBUG) {
            resp.status(500).json({"message": e.message});
            return;
        }
        resp.status(500).json({"message": "internal server error"});
    }
}