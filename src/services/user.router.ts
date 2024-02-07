import { RouterCallbackFunc } from '../server/server.types';
import { SuccessCodes, USER_URL } from '../utils/constants';
import { createNewUser, deleteUserById, getAllUsers, searchUser, updateUserById } from './user.service';
import { IUser } from './user.model';
import { commonJSONResponseHeaders } from '../utils/network';
import { ServerResponse } from 'http';
import { IRequest } from '../server/server.interfaces';
import { NotFoundEndpointError, InvalidBodyError, NotFoundError } from '../Errors/customErrors';

export const getUser: RouterCallbackFunc = (req, res) => {
    const { url } = req;
    const userId: string | undefined = url?.substring(`${USER_URL}/`.length);
  
    switch(url) {
        case USER_URL: getUsers(req, res);
            break;
        case `${USER_URL}/${userId}`: getUserById(req, res, userId);
            break;
        default: throw new NotFoundEndpointError();
    }
}

const getUsers:RouterCallbackFunc = (_, res) => {
    const users: IUser[] = getAllUsers();
    res.writeHead(SuccessCodes.OK, commonJSONResponseHeaders);
    res.end(JSON.stringify(users));
}

const getUserById = (_: IRequest, res: ServerResponse, userId: string | undefined) => {
    if (userId || userId === '') {
        const currentUser: IUser | undefined = searchUser(userId);
        res.writeHead(SuccessCodes.OK, commonJSONResponseHeaders);
        res.end(JSON.stringify(currentUser));
    }
}

export const createUser: RouterCallbackFunc = async (req, res) => {
    await bodyParser(req);
    if (req.url !== USER_URL) throw new NotFoundEndpointError();
    if (!req.body?.trim()) throw new InvalidBodyError();

    const newUser: IUser = createNewUser(JSON.parse(req.body));
    res.writeHead(SuccessCodes.Created, commonJSONResponseHeaders);
    res.end(JSON.stringify(newUser));
}

export const deleteUser: RouterCallbackFunc = (req, res) => {
    if (req.url !== USER_URL) throw new NotFoundEndpointError();
    const { url } = req;
    const id: string | undefined = url?.substring(`${USER_URL}/`.length);
    if (id || id === '') {
        deleteUserById(id);
        res.writeHead(SuccessCodes.NoContent, commonJSONResponseHeaders);
        res.end();
    }
}

export const updateUser: RouterCallbackFunc = async (req, res) => {
    await bodyParser(req);
    if (!req.url?.startsWith(USER_URL) ) throw new NotFoundError();
    if (!req.body?.trim()) throw new InvalidBodyError();
    
    const { url } = req;
    const id: string | undefined = url?.substring(`${USER_URL}/`.length);

    if (id || id === '') {
        const user: IUser = updateUserById(JSON.parse(req.body), id);
        res.writeHead(SuccessCodes.OK, commonJSONResponseHeaders);
        res.end(JSON.stringify(user));
    }
}

const bodyParser = async (req: IRequest) => {
    return new Promise((resolve, reject) => {
        let totalChunked = '';
        req
            .on('error', () => { reject(); })
            .on('data', (chunk: string) => { totalChunked += chunk; })
            .on('end', () => {
                req.body = totalChunked;
                resolve(null);
            });
    });
};