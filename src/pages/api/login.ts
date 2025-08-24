import { PrismaClient } from "@/generated/prisma";
import { isValidAltchaSolution } from "@/helpers/altcha";
import { jwtSign, jwtVerify } from "@/helpers/jwt";
import { createHash } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, resp: NextApiResponse) {
    const {secretid, altcha}:{secretid: string, altcha: string} = req.body;
    if (!await isValidAltchaSolution(req.body)) return resp.status(403).json({"message": "invalid captcha"});
    const user = await prisma.user.findFirst({
        where: {
            secretID: createHash('sha256').update(secretid).digest('hex'),
        }
    });

    if (user === null) return resp.status(403).json({"message": "invalid secret id"});

    const jwt = await jwtSign({
        "id": user.id,
    });
    resp.setHeader("Set-Cookie", `token=${jwt}; path=/; httponly=true`);
    resp.json({"message": "success", "isadmin": user.id === process.env.ADMIN_ID});
}