import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, resp: NextApiResponse) {
    const mpass = process.env.MASTER_PASSWORD !== undefined && process.env.MASTER_PASSWORD !== "";
    const dcaptcha = process.env.DOWNLOAD_CAPTCHA === "true";
    const dtheme = process.env.DEFAULT_THEME === undefined ? "light" : process.env.DEFAULT_THEME;
    resp.status(200).json({
        "masterpassword": mpass,
        "defaultheme": dtheme,
        "downloadcaptcha": dcaptcha,
    })
}