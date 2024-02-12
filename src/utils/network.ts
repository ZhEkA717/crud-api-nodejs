import { IncomingMessage } from "http";
import { IRequest } from "../server/server.interfaces";

export const getHostnameFromReq = (req: IncomingMessage) => req.headers.host?.split(':')[0];
export const bodyParser = async (req: IRequest) => {
    return new Promise((resolve, reject) => {
        let totalChunked = '';
        req
            .on('error', () => { reject(); })
            .on('data', (chunk: string) => { totalChunked += chunk; })
            .on('end', () => {
                req.body = totalChunked;
                resolve(null);
            });
    });
}; 
const CORSHeaders: { [header: string]: string } = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
};

export const commonJSONResponseHeaders: { [header: string]: string } = {
    "Content-Type": "application/json",
    ...CORSHeaders,
};