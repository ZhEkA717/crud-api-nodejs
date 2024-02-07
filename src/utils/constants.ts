import { v4 } from "uuid";
import { IUser } from "../services/user.model";

export enum SuccessCodes {
    "OK" = 200,
    "Created" = 201,
    "NoContent" = 204
}

export const USER_URL = '/api/user';

const dataBaseUsers: IUser[] = [];

export const getDataBase = (): IUser[] => dataBaseUsers;