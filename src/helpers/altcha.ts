import { verifySolution } from "altcha-lib";
import { ALTCHA_HMAC_KEY } from "./global";

let used:{[key: string]: boolean} = {};
let lastWiped = new Date().getTime();

export async function isValidAltchaSolution(answerJSON: {altcha: string}) {
    if (!("altcha" in answerJSON)) return false;
    if (answerJSON.altcha in used) return false;
    used[answerJSON.altcha] = true;
    const answer = answerJSON.altcha;
    
    const verified = await verifySolution(answer, ALTCHA_HMAC_KEY, true);
    if ((new Date().getTime() - lastWiped) >= (1000 * 120) && verified) {
        used = {};
        lastWiped = new Date().getTime();
    }
    return verified;
}