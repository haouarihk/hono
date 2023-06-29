import { GettingObject } from "./types";

export async function getActions(req: { text: any }, textBody: string) {
    const query = new URLSearchParams(textBody)
    const keys = Array.from(query.keys());
    const obj: any = {};
    keys.forEach((key) => {
        obj[key] = query.get(key);
    })
    return obj as GettingObject;
}


export async function checkSignature(req: Request, textBody: string) {
    // run locally to prevent this
    // const givenHash = req.header()["x-request-signature"]
    // const values = textBody.split("&").sort((a, b) => a > b ? 1 : -1).join(",");
    // const all = `${serverURL},${values},${password}`;
    // const hash = createHash("sha1").update(all).digest("base64");
    // console.log(hash, givenHash, all)
}