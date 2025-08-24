import { PrismaClient } from "@/generated/prisma";
import { isValidAltchaSolution } from "@/helpers/altcha";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { SignJWT } from 'jose';
import { jwtSign } from "@/helpers/jwt";
import { createHash } from "crypto";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, resp: NextApiResponse) {
    try {
        const { masterpassword } = req.body; 
        if (!await isValidAltchaSolution(req.body)) return resp.status(403).json({"message": "invalid captcha"});
        if ((process.env.MASTER_PASSWORD ?? "").length > 0 && masterpassword !== process.env.MASTER_PASSWORD) return resp.status(403).json({"message": "invalid master password"});

        const secretID = uuidv4();
        await prisma.user.create({
            data: {
                secretID: createHash('sha256').update(secretID).digest('hex'),
            },
        });
        resp.status(200).json({
            "id": secretID,
        });
    }catch(e: any) {
        if (process.env.DEBUG) {
            resp.status(500).json({"message": e.message});
            return;
        }
        resp.status(500).json({"message": "something went wrong"});
    }
}