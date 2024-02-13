import { IUser } from "../services/user.model";
import { DB_URL_API, dataBaseUsers } from "../utils/constants";

export const getDataBaseApi = async (): Promise<IUser[]> => {
    if (process.env.MODE_ENV === 'multi') {
        let response = await fetch(DB_URL_API);
        if (response.ok) {
            let database = await response.json();
            return database;
        }
    }
    return dataBaseUsers;
};

export const updateDataBaseApi = async (dataBase: IUser[]) => {
    if (process.env.MODE_ENV === 'multi') {
        await fetch(DB_URL_API, {
            method: "post",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataBase)
        })
    }
}