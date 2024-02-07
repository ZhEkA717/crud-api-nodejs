import { v4, validate } from "uuid";
import { getDataBase } from "../utils/constants";
import { CreateUser, IUser } from "./user.model";
import { InvalidIdUUIDError, NotFoundError } from "../Errors/customErrors";
import { userValidate } from "../utils/userValidate";

export const getAllUsers = (): IUser[] => getDataBase();

export const searchUser = (id: string) => {
    if (!validate(id)) throw new InvalidIdUUIDError(id);

    const user: IUser | undefined = getDataBase().find(item => item.id === id);
    if (!user) throw new NotFoundError();
    return  user;
}

export const createNewUser = (user: CreateUser): IUser => {
    const id = v4();
    const newUser = {
        id,
        ...user
    }

    userValidate(newUser);
    getDataBase().push(newUser);
    
    return newUser;
}