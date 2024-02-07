import { RouterCallbackFunc } from '../server/server.types';
import { SuccessCodes, USER_URL } from '../utils/constants';
import { createNewUser, getAllUsers, searchUser } from './user.service';
import { CreateUser, IUser } from './user.model';
import { commonJSONResponseHeaders } from '../utils/network';
import { ServerResponse } from 'http';
import { IRequest } from '../server/server.interfaces';

export const getUser: RouterCallbackFunc = (req, res) => {
    const { url } = req;
    const userId: string | undefined = url?.substring(`${USER_URL}/`.length);
  
    switch(url) {
        case USER_URL: getUsers(req, res);
            break;
        case `${USER_URL}/${userId}`: getUserById(req, res, userId);
            break;
    }
}

const getUsers:RouterCallbackFunc = (req, res) => {
    const users: IUser[] = getAllUsers();
    res.writeHead(SuccessCodes.OK, commonJSONResponseHeaders);
    res.end(JSON.stringify(users));
}

const getUserById = (req: IRequest, res: ServerResponse, userId: string | undefined) => {
    if (userId) {
        const currentUser: IUser | undefined = searchUser(userId);
        res.writeHead(SuccessCodes.OK, commonJSONResponseHeaders);
        res.end(JSON.stringify(currentUser));
    } else {
        throw new Error('Board ID not provided');
    }
}

export const createUser: RouterCallbackFunc = async (req, res) => {
    await bodyParser(req);
    if (!req.body) throw new Error('not exist body data');
    const data: CreateUser = req.body;
    const newUser: IUser = createNewUser(data);
    res.writeHead(SuccessCodes.Created, JSON.stringify(commonJSONResponseHeaders));
    res.end(JSON.stringify(newUser));
}

export const deleteUser: RouterCallbackFunc = (req, res) => {

}

export const updateUser: RouterCallbackFunc = (req, res) => {

}

const bodyParser = async (req: IRequest) => {
    return new Promise((resolve, reject) => {
        let totalChunked = '';
        req
            .on('error', () => { reject(); })
            .on('data', (chunk: string) => { totalChunked += chunk; })
            .on('end', () => {
                req.body = JSON.parse(totalChunked); // Adding Parsed Chunked into request.body
                resolve(totalChunked);
            });
    });
};