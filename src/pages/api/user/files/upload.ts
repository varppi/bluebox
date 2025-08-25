import { PrismaClient } from "@/generated/prisma";
import { jwtVerify } from "@/helpers/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import { File } from "@/helpers/global";
import formidable, { IncomingForm } from 'formidable';
import { readFile } from "node:fs";

const prisma = new PrismaClient();

export const config = {
    api: {
      bodyParser: false,
    },
  };


export default async function handler(req: NextApiRequest, resp: NextApiResponse) {
    const payload = await jwtVerify(req.cookies.token ?? "");
    if (payload === null) return resp.status(403).json({"message": "access denied"});
    const userId: string = payload.id as string;

    try {
        const form = new IncomingForm();

        const [fields, files]: [any, any] = await form.parse(req);
        if ((files.file??[]).length < 1) return resp.status(400).json({"message": "no files to upload"});
        const upload = files.file[0];

        readFile(upload.filepath, async (readErr: NodeJS.ErrnoException | null, data: Buffer) => {
            if (readErr) {
                return resp.status(500).json({ error: 'error reading file' });
            }
            await prisma.file.create({
                data: {
                    fileName: upload.originalFilename,
                    created: new Date(),
                    data: data,
                    userId: userId, 
                },
            });
        });

        resp.status(201).json({ message: 'file uploaded successfully', files, fields });
    }catch(e: any) {
        if (process.env.DEBUG === "true") {
            resp.status(500).json({"message": e.message});
            return;
        }
        resp.status(500).json({"message": "internal server error"});
    }
}