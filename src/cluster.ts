import cluster from 'node:cluster';
import { cpus } from 'os';
import { createServer, router } from './server/server';
import { RequestOptions, request } from 'http';
import { getHostnameFromReq } from './utils/network';

let currentWorker: number = 0;


const workersData = new Map<number, number>();

const getIndexNextWorker = (): number => {
    currentWorker %= cpus().length;
    return currentWorker++;
};

if (cluster.isPrimary) {
    const cpusCount = cpus().length;
    for (let i = 1; i <= cpusCount; i++) {
        const worker = cluster.fork();
        const port = 4000 + i;
        worker.send({ port });

        if (worker) workersData.set(worker?.id, port);
    }

    const server = createServer();

    server.on('request', async (req, res) => {
        const currentPort = workersData.get(getIndexNextWorker() + 1);
        const { url, method, headers } = req;
        const options: RequestOptions = {
            hostname: getHostnameFromReq(req),
            port: currentPort,
            path: url,
            method,
            headers
        }

        const proxy = request(options, async (proxyResponse) => {
            await router(proxyResponse, res)
            proxyResponse.pipe(res, {
                end: true,
            });
        });

        req.pipe(proxy, {
            end: true,
        });
    });

    server.listen(4000, () => {
        console.log(`Load balancer server is running: http://localhost:${4000}`);
    });
}

if (cluster.isWorker) {
    process.on('message', (msg: { port: number }) => {
        createServer().listen(msg.port, () => {
            console.log(`Fork server is running: http://localhost:${msg.port}`);
        })
    });
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
    });
}
