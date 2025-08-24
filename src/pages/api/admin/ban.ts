import { PrismaClient } from "@/generated/prisma";
import { jwtVerify } from "@/helpers/jwt";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, resp: NextApiResponse) {
    const payload = await jwtVerify(req.cookies.token ?? "");
    if (payload === null || payload.id !== process.env.ADMIN_ID) return resp.status(403).json({"message": "access denied"});
    const userId: string = payload.id as string;

    const { id } = req.body;

    await prisma.file.deleteMany({
        where: {
            createdBy: {
                id: id,
            },
        },
    });
    await prisma.user.delete({
        where: {
            id: id,
        },
    });
    resp.status(200).json({"message": "account deleted"});
}