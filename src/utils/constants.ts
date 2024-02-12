import { IUser } from "../services/user.model";

export enum SuccessCodes {
    "OK" = 200,
    "Created" = 201,
    "NoContent" = 204
}

export const SERVER_PORT: number = Number(process.env.SERVER_PORT) || 4000;

export const USER_URL = '/api/users';

const dataBaseUsers: IUser[] = [];

export const getDataBase = (): IUser[] => dataBaseUsers;