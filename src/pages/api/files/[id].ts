import { PrismaClient } from "@/generated/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server"

const prisma = new PrismaClient();

export default async function GET(req: NextApiRequest, resp: NextApiResponse) {
    const file = await prisma.file.findFirst({
        where: {
            id: req.query.id as string,
        },
    });
    if (!file) return resp.status(404);
  
    resp.setHeader('Content-Type', 'application/octet-stream');
    resp.setHeader('Content-Disposition', `attachment; filename="${file.fileName}"`);
    resp.send(Buffer.from(file.data)); 
}