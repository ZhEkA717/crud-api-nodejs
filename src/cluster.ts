import cluster from 'node:cluster';
import { cpus } from 'os';
import { createServer } from './server/server';
import { SERVER_PORT } from './utils/constants';
import { createProxyServer } from './balancer';

export const workersData = new Map<number, number>();

const createWorkers = () => {
    const cpusCount = cpus().length;
    for (let i = 1; i <= cpusCount; i++) {
        const worker = cluster.fork();
        const port = SERVER_PORT + i;
        worker.send({ port });

        if (worker) workersData.set(worker?.id, port);
    }
}

if (cluster.isPrimary) {
    createProxyServer();
    createWorkers();
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