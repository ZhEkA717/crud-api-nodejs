import { v4, validate } from "uuid";
import { CreateUser, IUser } from "./user.model";
import { InvalidIdUUIDError, NotFoundError } from "../Errors/customErrors";
import { userValidate } from "../utils/userValidate";
import { getDataBaseApi, updateDataBaseApi } from "../serverDB/database";

export const getAllUsers = async (): Promise<IUser[]> => await getDataBaseApi();

export const searchUser = async (id: string): Promise<IUser> => {
    if (!validate(id)) throw new InvalidIdUUIDError(id);
    const dataBase = await getDataBaseApi();

    const user: IUser | undefined = dataBase.find(item => item.id === id);
    if (!user) throw new NotFoundError();
    return  user;
}

export const createNewUser = async (data: CreateUser): Promise<IUser> => {
    const id = v4();
    const dataBase = await getDataBaseApi();
    const newUser = {
        id,
        ...data
    }

    userValidate(data);
    dataBase.push(newUser);
    await updateDataBaseApi(dataBase);
    
    return newUser;
}

export const deleteUserById = async (id: string): Promise<void> => {
    if (!validate(id)) throw new InvalidIdUUIDError(id);
    
    const existingUser: IUser | undefined = await searchUser(id);

    if (existingUser) {
        const dataBase = await getDataBaseApi();
        const index: number = dataBase.indexOf(existingUser);
        dataBase.splice(index, 1);
        await updateDataBaseApi(dataBase);
    }
}

export const updateUserById = async (data: CreateUser, id: string): Promise<IUser> => {
    if (!validate(id)) throw new InvalidIdUUIDError(id);

    userValidate(data);
    
    const existingUser: IUser | undefined = await searchUser(id);

    if (existingUser) {
        const dataBase: IUser[] = await getDataBaseApi();
        const index = dataBase.indexOf(existingUser);
        dataBase[index] = {...dataBase[index], ...data};
        await updateDataBaseApi(dataBase);
    }
    
    return { id, ...data }
}