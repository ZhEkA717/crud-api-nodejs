import { cpus } from "os";
import { ServerInternalError } from "../Errors/customErrors";
import { ErrorMessages, SERVER_PORT } from "../utils/constants";
import http from 'http';
import { workersData } from "../cluster";

let currentWorker: number = 0;

const getIndexNextWorker = (): number => {
    currentWorker %= cpus().length;
    return currentWorker++;
};

export function createProxyServer(): void {
    const proxyServer = http.createServer((req, res) => {
        const port = workersData.get(getIndexNextWorker() + 1);        

        const { url: path, method, headers } = req;
        const options = { method, headers, port, path };

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