import { createChallenge, solveChallenge } from "altcha-lib";
import { isValidAltchaSolution } from "../src/helpers/altcha";
import { ALTCHA_HMAC_KEY } from "../src/helpers/global";

test('altcha generate and verify solution', async ()=> {
    const challenge = await createChallenge({
        hmacKey: ALTCHA_HMAC_KEY,
        maxNumber: 500_000,
    });
    const answer = await solveChallenge(challenge.challenge, challenge.salt).promise;
    expect(await isValidAltchaSolution({
        "altcha": "wefewf"
    })).toBeFalsy();
    expect(await isValidAltchaSolution({
        "altcha": btoa(JSON.stringify({
            "algorithm": challenge.algorithm,
            "challenge": challenge.challenge,
            "number": answer?.number,
            "salt": challenge.salt,
            "signature": challenge.signature,
            "took": answer?.took
        }))
    })).toBeTruthy();
});