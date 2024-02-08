import { v4, validate } from "uuid";
import { getDataBase } from "../utils/constants";
import { CreateUser, IUser } from "./user.model";
import { InvalidIdUUIDError, NotFoundError } from "../Errors/customErrors";
import { userValidate } from "../utils/userValidate";

export const getAllUsers = (): IUser[] => getDataBase();

export const searchUser = (id: string): IUser => {
    if (!validate(id)) throw new InvalidIdUUIDError(id);

    const user: IUser | undefined = getDataBase().find(item => item.id === id);
    if (!user) throw new NotFoundError();
    return  user;
}

export const createNewUser = (data: CreateUser): IUser => {
    const id = v4();
    const newUser = {
        id,
        ...data
    }

    userValidate(data);
    getDataBase().push(newUser);
    
    return newUser;
}

export const deleteUserById = (id: string): void => {
    if (!validate(id)) throw new InvalidIdUUIDError(id);
    
    const existingUser: IUser | undefined = searchUser(id);

    if (existingUser) {
        const dataBase = getDataBase();
        const index: number = dataBase.indexOf(existingUser);
        dataBase.splice(index, 1);
    }
}

export const updateUserById = (data: CreateUser, id: string): IUser => {
    if (!validate(id)) throw new InvalidIdUUIDError(id);

    userValidate(data);
    
    const existingUser: IUser | undefined = searchUser(id);

    if (existingUser) {
        const dataBase: IUser[] = getDataBase();
        const index = dataBase.indexOf(existingUser);
        dataBase[index] = {...dataBase[index], ...data};
    }
    
    return { id, ...data }
}