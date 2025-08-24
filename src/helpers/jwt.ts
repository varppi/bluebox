import { randomBytes } from "crypto";
import { SignJWT, jwtVerify as joseJwtVerify } from "jose";

const JWT_SECRET: string = process.env.JWT_SECRET || randomBytes(16).toString('hex');
const FINAL_SECRET = new TextEncoder().encode(JWT_SECRET);

export async function jwtSign(payload: any) {
    const alg = 'HS256'
    const jwtToken = await new SignJWT(payload)
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(FINAL_SECRET);
    return jwtToken;
}

export async function jwtVerify(token: string) {
    try {
        const {payload, protectedHeader} = await joseJwtVerify(token, FINAL_SECRET);
        return payload;
    }catch{
        return null;
    }
}