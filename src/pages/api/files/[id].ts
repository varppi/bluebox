import { PrismaClient } from "@/generated/prisma";
import { isValidAltchaSolution } from "@/helpers/altcha";
import { jwtVerify } from "@/helpers/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server"

const prisma = new PrismaClient();

export default async function GET(req: NextApiRequest, resp: NextApiResponse) {
    const payload = await jwtVerify(req.cookies.token ?? "");
    let userId: string = "";
    if (payload !== null) {
        userId = payload.id as string;
    }

    const file = await prisma.file.findFirst({
        where: {
            id: req.query.id as string,
        },
    });
    if (!file) return resp.status(404);
    if (process.env.DOWNLOAD_CAPTCHA === "true" && file.userId !== userId) {
        const payload:{altcha: string} = {altcha: req.query.altcha === undefined || req.query.altcha === null ? "" : req.query.altcha.toString()};
        if (!await isValidAltchaSolution(payload)) return resp.status(403).json({"message": "invalid captcha"});
    }
  
    resp.setHeader('Content-Type', 'application/octet-stream');
    resp.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`);
    resp.send(Buffer.from(file.data)); 
}