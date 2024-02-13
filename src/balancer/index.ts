import { cpus } from "os";
import { ErrorMessages, ServerInternalError } from "../Errors/customErrors";
import { SERVER_PORT } from "../utils/constants";
import http from 'http';
import { workersData } from "../cluster";

let currentWorker: number = 0;


const getIndexNextWorker = (): number => {
    currentWorker %= cpus().length;
    return currentWorker++;
};

export function createProxyServer(): void {
    const proxyServer = http.createServer((req, res) => {
        const workerPort = workersData.get(getIndexNextWorker() + 1);        

        const { url, method, headers } = req;

        headers.host = `localhost:${workerPort}`;

        const options = {
            method,
            headers,
            joinDuplicatedHeaders: true,
            port: workerPort,
            path: url,
        };

        const proxyRequest = http.request(options, (proxyRes) => {
            proxyRes.pipe(
                res.writeHead(proxyRes.statusCode || 302, proxyRes.headers),
                { end: true, }
            );
        });

        req.pipe(proxyRequest, { end: true, })

        proxyRequest.on('error', () => {
            throw new ServerInternalError(ErrorMessages.SERVER_INTERNAL);
          });
    });

    proxyServer.listen(SERVER_PORT, () => {
        console.log(`Load balancer server is running: http://localhost:${SERVER_PORT}`);
    })
};