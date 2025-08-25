import { NextApiRequest, NextApiResponse } from "next";
import {createChallenge} from "altcha-lib"
import { ALTCHA_HMAC_KEY } from "@/helpers/global";

export default async function handler(req: NextApiRequest, resp: NextApiResponse) {
    const challenge = await createChallenge({
        hmacKey: ALTCHA_HMAC_KEY,
        maxNumber: parseInt(process.env.CAPTCHA_DIFFICULTY ?? "500000"),
        expires: new Date(new Date().getTime() + (1000 * 60)),
    });
    return resp.status(200).json(challenge);
}