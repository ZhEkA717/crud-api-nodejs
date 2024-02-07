import { UserBadRequestError } from "../Errors/customErrors";
import { IUser } from "../services/user.model";

export const userValidate = (user: IUser) => {
    const { username, age, hobbies } = user;
    if (!username || typeof username !== 'string')
        throw new UserBadRequestError('username');
    if (!age || typeof age !== 'number')
        throw new UserBadRequestError('age');
    if (!hobbies || !Array.isArray(hobbies)) {
        throw new UserBadRequestError('hobbies');
    }
    arrayOfStringValidate(hobbies);
}

const arrayOfStringValidate = (array: string[]) => {
    array.forEach(item => {
        if (typeof item !== 'string')
        throw new UserBadRequestError('hobbies');
    })
}