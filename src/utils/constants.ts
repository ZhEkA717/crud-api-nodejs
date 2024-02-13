import { IUser } from "../services/user.model";

export enum SuccessCodes {
    "OK" = 200,
    "Created" = 201,
    "NoContent" = 204
}

export const enum ErrorCodes {
    'BAD_REQUEST' = 400,
    'NOT_FOUND' = 404,
    'SERVER_ERROR' = 500,
}

export const enum ErrorMessages {
    BAD_REQUEST = 'Bad Request',
    NOT_FOUND = 'Not Found',
    SERVER_INTERNAL = 'Server Internal Error',
    NOT_FOUND_ENDPOINT = 'NOT FOUND ENDPOINT',
    INVALID_BODY = 'Invalid requests body',
    EMPTY_ID = 'Id is empty',
    INVALID_UUID = 'Id is invalid (not uuid)'
}

export const SERVER_PORT: number = process.env.MODE_ENV === 'multi' 
    ? 4000 
    : Number(process.env.SERVER_PORT) || 4000;

export const USER_URL = '/api/users';
export const DB_URL = '/api/database';
export const DB_URL_API = 'http://localhost:5000/api/database';

export const dataBaseUsers: IUser[] = [];