import { envConfig } from "../common/config";
import http from 'http';
import { createUser, deleteUser, getUser, updateUser } from "../services/user.router";
import { MethodType } from "./server.types";
import { preflightRequest } from "../utils/network";
import { USER_URL } from "../utils/constants";
import { NotFoundEndpointError } from "../Errors/customErrors";
import { handleError } from "../Errors/handleError";

const SERVER_USERS = {
    GET: getUser,
    POST: createUser,
    DELETE: deleteUser,
    PUT: updateUser
}

export const createServer = (port = envConfig.SERVER_PORT) => {
    const server = http.createServer(async (req, res) => {
        const method = req.method as MethodType;
        try {
            // if (req.url !== USER_URL && method !== "GET" ) {
            //     throw new NotFoundEndpointError();
            // }

            if (method === 'OPTIONS') {
                preflightRequest(req, res);
            } else {
                await SERVER_USERS[method](req, res)
            }
        } catch(err) {
            handleError(req, res, err);
        }
    });
    
    server.listen(port, () => {
        console.log(`Server running on Port ${port}`)
    });
    
    return server;
}



