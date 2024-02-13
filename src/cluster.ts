import cluster from 'node:cluster';
import { cpus } from 'os';
import { createServer } from './server/server';
import { SERVER_PORT } from './utils/constants';
import { createProxyServer } from './balancer';
import { createServerDB } from './serverDB';

export const workersData = new Map<number, number>();

const createWorkers = () => {
    const cpusCount = cpus().length;
    for (let i = 1; i <= cpusCount; i++) {
        const worker = cluster.fork();
        const port = SERVER_PORT + i;
        worker.send({ port });

        if (worker) workersData.set(worker?.id, port);

        worker.on("message", (msg) => {
            const port = workersData.get(msg.id);
            console.log(`Worker pid: ${msg.pid}. Request from port: ${port}`)
        })
    }
}

if (cluster.isPrimary) {
    createServerDB();
    createProxyServer();
    createWorkers();
}

if (cluster.isWorker) {
    process.on('message', async (msg: { port: number }) => {
        createServer().listen(msg.port, () => {
            console.log(`Worker pid: ${process.pid}. Fork server is running: http://localhost:${msg.port}`);
        })
    });
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
    });
}