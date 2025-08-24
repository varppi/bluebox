import { PrismaClient } from "@/generated/prisma";
import { jwtVerify } from "@/helpers/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import { File } from "@/helpers/global";
import formidable, { IncomingForm } from 'formidable';
import { readFile } from "node:fs";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, resp: NextApiResponse) {
    const payload = await jwtVerify(req.cookies.token ?? "");
    if (payload === null) return resp.status(403).json({"message": "access denied"});
    const userId: string = payload.id as string;

    const getHandler = async ()=>{
        const files = await prisma.file.findMany({
            where: {
                userId: userId,
            }
        });
        const formattedFiles: File[] = files.map(file => {
            return  {
                "fileName": file.fileName,
                "created": file.created,
                "id": file.id,
            };
        })
    
        resp.json(formattedFiles);
    }

    const deleteHandler = async()=>{
        const {id}:{id: string} = req.body;
        if (!id) return resp.status(400).json({"message": "id not specified"});
        
        const result = await prisma.file.deleteMany({
            where: {
                id: id,
            },
        });
        return resp.json({"message": `file ${result} deleted`});
    }
    try {
        switch(req.method) {
            case "GET":
                await getHandler();
                break;
            case "DELETE":
                await deleteHandler();
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