import http, { ServerResponse } from 'http';
import { IRequest } from '../server/server.interfaces';
import { DB_URL, SuccessCodes } from '../utils/constants';
import { IUser } from '../services/user.model';
import { RouterCallbackFunc } from '../server/server.types';
import { bodyParser, commonJSONResponseHeaders } from '../utils/network';
import { NotFoundEndpointError, NotFoundError } from '../Errors/customErrors';
import { handleError } from '../Errors/handleError';

let database: IUser[] = []; 

export const createServerDB = () => {
    const serverDB = http.createServer((req: IRequest, res: ServerResponse) => {
        const { method, url } = req;
    
        try {
            if (url === DB_URL) {
                switch(method) {
                    case 'GET': getDataBase(req, res);
                        break;
                    case 'POST': updateDataBase(req, res); 
                        break;
                    default: throw new NotFoundError();
                }
            } else {
                throw new NotFoundEndpointError();
            }
        } catch (err) {
            handleError(req,res,err);
        }
    })
    
    if (process.env.MODE_ENV === 'multi') {
        serverDB.listen(5000);
    }
}

const getDataBase: RouterCallbackFunc = (_, res) => {
    res.writeHead(SuccessCodes.OK, commonJSONResponseHeaders);
    res.end(JSON.stringify(database));
};

const updateDataBase: RouterCallbackFunc = async (req, res) => {
    await bodyParser(req);

    if (req.body) {
        const newDataBase: IUser[] = JSON.parse(req.body);
        database = newDataBase;
    }
    res.writeHead(SuccessCodes.OK, commonJSONResponseHeaders);
    res.end();
}