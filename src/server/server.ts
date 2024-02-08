import 'dotenv/config';
import http from 'http';
import { createUser, deleteUser, getUser, updateUser } from "../services/user.router";
import { MethodType } from "./server.types";
import { handleError } from "../Errors/handleError";

const SERVER_USERS = {
    GET: getUser,
    POST: createUser,
    DELETE: deleteUser,
    PUT: updateUser
}

const PORT = process.env.SERVER_PORT || 4000;

export const createServer = () => {
    const server = http.createServer(async (req, res) => {
        const method = req.method as MethodType;
        try {
            await SERVER_USERS[method](req, res)
        } catch(err) {
            handleError(req, res, err);
        }
    });
    
    server.listen(PORT, () => {
        console.log(`Server running on Port ${PORT}`)
    });
    
    return server;
}



function preflightRequest(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage; }) {
    throw new Error('Function not implemented.');
}

