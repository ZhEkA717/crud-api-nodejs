import { v4, validate } from "uuid";
import { getDataBase } from "../utils/constants";
import { CreateUser, IUser } from "./user.model";

export const getAllUsers = (): IUser[] => getDataBase();

export const searchUser = (id: string) => {
    if (!validate(id)) throw new Error(' ID not validate uuid');

    const user: IUser | undefined = getDataBase().find(item => item.id = id);

    if (!user) throw new Error('user not exist');

    return  user;
}

export const createNewUser = (user: CreateUser): IUser => {
    const id = v4();
    const newUser = {
        id,
        ...user
    }
    getDataBase().push(newUser);

    return newUser;
}