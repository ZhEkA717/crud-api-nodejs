import cluster from 'node:cluster';
import { cpus } from 'os';
import { createServer } from './server/server';

const workersData = new Map<number, number>();

if (cluster.isPrimary) {
    const cpusCount = cpus().length;
    for (let i = 1; i <= cpusCount; i++) {
        const worker = cluster.fork();
        const port = 4000 + i;
        worker.send({ port });

        if (worker) workersData.set(worker?.id, port);
    }

    const server = createServer();
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
