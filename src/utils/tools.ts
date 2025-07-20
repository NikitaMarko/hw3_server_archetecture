import {IncomingMessage} from "node:http";
import {BASE_URL, PORT} from "../config/userServerConfig.ts";
import * as url from "node:url";

export async function parseBody(req: IncomingMessage) {
    return new Promise((resolve, reject) => {
        let body = "";
        req.on('data', (chunk) => {
            body += chunk.toString();
        })
        req.on('end', () => {
            try {
                resolve(JSON.parse(body))
            } catch (e) {
                reject(new Error('Invalid json'))
            }
        })
    })
}

export function parseRequestUrl(req: IncomingMessage):URL {
    const{url} = req;

    if (!url) {
        throw new Error("Request URL is undefined");
    }

    return new URL(url!, `${BASE_URL}:${PORT}`)
}