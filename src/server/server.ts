import { envConfig } from "../common/config";
import http from 'http';
import { createUser, deleteUser, getUser, updateUser } from "../services/user.router";
import { MethodType } from "./server.types";
import { preflightRequest } from "../utils/network";
import { USER_URL } from "../utils/constants";
import { IRequest } from "./server.interfaces";

const SERVER_USERS = {
    GET: getUser,
    POST: createUser,
    DELETE: deleteUser,
    PUT: updateUser
}

export const createServer = (port = envConfig.SERVER_PORT) => {
    const server = http.createServer((req, res) => {
        const method = req.method as MethodType;
        
        try {

            if (!req.url?.startsWith(USER_URL)) {
                throw new Error('endpoint not exist');
            }

            if (method === 'OPTIONS') {
                preflightRequest(req, res);
            } else {
                SERVER_USERS[method](req, res);
            }
        } catch(err) {
            console.log(err);
        }
    });
    
    server.listen(port, () => {
        console.log(`Server running on Port ${port}`)
    });
    
    return server;
}



