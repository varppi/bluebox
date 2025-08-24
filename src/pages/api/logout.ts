import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, resp: NextApiResponse) {
    resp.setHeader("Set-Cookie", "token=deleted; path=/; Expires=Thu, 01 Jan 1970 00:00:00:00 GMT");
    resp.redirect("/");
}