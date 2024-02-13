import 'dotenv/config';
import http, { IncomingMessage, ServerResponse } from 'http';
import { createUser, deleteUser, getUser, updateUser } from "../services/user.router";
import { MethodType, RouterCallbackFunc } from "./server.types";
import { handleError } from "../Errors/handleError";
import { IRequest } from './server.interfaces';
import cluster from 'cluster';

const SERVER_USERS = {
    GET: getUser,
    POST: createUser,
    DELETE: deleteUser,
    PUT: updateUser
}

export const createServer = () => {
    const server = http.createServer();
    server.on('request', router);    
    return server;
}

export const router = async (req:IRequest, res:ServerResponse) => {

    if(cluster.isWorker) {
        cluster.worker?.send({
            id: cluster.worker.id,
            pid: process.pid
        });
    }

    const method = req.method as MethodType;
    try {
        await SERVER_USERS[method](req, res)
    } catch(err) {
        handleError(req, res, err);
    }
}