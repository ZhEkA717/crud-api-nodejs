import request from "supertest";
import { createServer } from "../server/server";
import { SuccessCodes, USER_URL } from "../utils/constants";
import { ErrorCodes, ErrorMessages } from "../Errors/customErrors";
import { v4 } from "uuid";
import { IUser } from "../services/user.model";
import { updateUser } from "../services/user.router";

const server = createServer();
const serverRequest = request(server);

let testDataBase: IUser[] = [];

const testUser = {
    username: 'Zheka',
    age: 23,
    hobbies: ['programming', 'nodeJS'],
};

let createdUser: IUser = {} as IUser;

afterAll((done) => {
    server.close();
    done();
});

describe('\nGET api/users', () => {
    it ('Should answer with status code 200 and empty array', async () => {
        // Get all records with a GET api/users request 
        // (an empty array is expected)
        await serverRequest.get(USER_URL)
            .expect(SuccessCodes.OK, testDataBase);
    });

    it ('Should answer with status code 200 and array with records', async () => {
        const newUser = (await serverRequest.post(USER_URL).send(testUser))
            .body;
        testDataBase.push(newUser);

        await serverRequest.get(USER_URL)
            .expect(SuccessCodes.OK, testDataBase);
    })

    it ('Should answer with status code 404', async () => {
        // Requests to non-existing endpoints (e.g. some-non/existing/resource)
        // should be handled (server should answer with status code 404
        // and message "NOT FOUND ENDPOINT")
        await serverRequest.get('/some-non/existing/resource')
            .expect(ErrorCodes.NOT_FOUND, ErrorMessages.NOT_FOUND_ENDPOINT);
    });
});

describe('\nPOST api/users', () => {
    it ('Should answer with status code 201 and newly created record', async () => {
        const res = await serverRequest.post(USER_URL).send(testUser);
        testDataBase.push(res.body);
        createdUser = res.body;
        expect(res.statusCode).toEqual(SuccessCodes.Created);
        expect(res.body).toHaveProperty('username');
        expect(res.body).toHaveProperty('age');
        expect(res.body).toHaveProperty('hobbies');
        expect(res.body).toHaveProperty('id');
        expect(testDataBase).toHaveLength(2);
    });

    it ('Server should answer with status code 400 if body is string', async () => {
        const res = await serverRequest.post(USER_URL).send('not empty string');
        expect(res.statusCode).toEqual(ErrorCodes.BAD_REQUEST);
    });
    it ('Server should answer with status code 400 if body is empty string', async () => {
        await serverRequest.post(USER_URL).send('')
            .expect(ErrorCodes.BAD_REQUEST, ErrorMessages.INVALID_BODY);
    });
    it ('Server should answer with status code 400 if body is empty array ', async () => {
        const res = await serverRequest.post(USER_URL).send([]);
        expect(res.statusCode).toEqual(ErrorCodes.BAD_REQUEST);
    });
    it ('Server should answer with status code 400 if body is empty object', async () => {
        await serverRequest.post(USER_URL).send({})
            .expect(ErrorCodes.BAD_REQUEST);
    });
    it ('Server should answer with status code 400 if body is null', async () => {
        await serverRequest.post(USER_URL).send('null')
            .expect(ErrorCodes.BAD_REQUEST, ErrorMessages.INVALID_BODY);
    });
    it ('Server should answer with status code 400 if body does not required age and hobbies ', async () => {
        await serverRequest.post(USER_URL).send({
            username: 'user'
        })
            .expect(ErrorCodes.BAD_REQUEST);
    });
    it ('Server should answer with status code 400 if body does not required username and hobbies ', async () => {
        await serverRequest.post(USER_URL).send({
            age: 10
        })
            .expect(ErrorCodes.BAD_REQUEST);
    });
    it ('Server should answer with status code 400 if body does not required username and age ', async () => {
        await serverRequest.post(USER_URL).send({
            hobbies: ["hobby"]
        })
            .expect(ErrorCodes.BAD_REQUEST);
    });
    it ('Server should answer with status code 400 if body does not required hobbies ', async () => {
        await serverRequest.post(USER_URL).send({
            username: 'hobbies',
            age: 23,
        })
            .expect(ErrorCodes.BAD_REQUEST);
    });
    it ('Server should answer with status code 400 if body does not required username ', async () => {
        await serverRequest.post(USER_URL).send({
            age: 23,
            hobbies: []
        })
            .expect(ErrorCodes.BAD_REQUEST);
    });
    it ('Server should answer with status code 400 if body does not required age ', async () => {
        await serverRequest.post(USER_URL).send({
            username: 23,
            hobbies: []
        })
            .expect(ErrorCodes.BAD_REQUEST);
    });
    it ('Server should answer with status code 400 if body does not correspond to the types ', async () => {
        await serverRequest.post(USER_URL).send({
            username: 'zheka',
            age: 5,
            hobbies: [1,2,3]
        })
            .expect(ErrorCodes.BAD_REQUEST);
    });
});


describe('\nGET api/user/{userId}', () => {    
    it('Server should answer with status code 200 and record', async () => {
        await serverRequest.get(`${USER_URL}/${createdUser.id}`)
            .expect(SuccessCodes.OK, createdUser);
    })

    it('Should answer with status code 404 and message "Not found"', async () => {
        // Server should answer with status code 404 
        // and message "Not found" if record with id === userId doesn't exist

        await serverRequest.get(`${USER_URL}/${v4()}`)
            .expect(ErrorCodes.NOT_FOUND, ErrorMessages.NOT_FOUND);
    })

    it('Should answer with status code 400 and message "Id is invalid (not uuid)"', async () => {
        // Server should answer with status code 400 
        // and message "Id is invalid (not uuid)" if userId is invalid (not uuid)
        await serverRequest.get(`${USER_URL}/not uuid`)
            .expect(ErrorCodes.BAD_REQUEST, ErrorMessages.INVALID_UUID);
    })

    it('Should answer with status code 400 and message "Id is empty"', async () => {
        // Server should answer with status code 400 
        // and message "Id is empty" if userId is empty
        await serverRequest.get(`${USER_URL}/`)
            .expect(ErrorCodes.BAD_REQUEST, ErrorMessages.EMPTY_ID);
    })
});

describe('\nDELETE api/users/{userID}', () => {
    it ('Should answer with status code 204 and record deleted', async () => {
        const res = await serverRequest.delete(`${USER_URL}/${createdUser.id}`);
        const index: number = testDataBase.indexOf(createdUser);
        testDataBase.splice(index, 1);
        expect(res.statusCode).toEqual(SuccessCodes.NoContent);
        expect(res.body).toBe('');
        expect(testDataBase).toHaveLength(1);
    });

    it('Should answer with status code 404 and message "Not found"', async () => {
        // Server should answer with status code 404 
        // and message "Not found" if record with id === userId doesn't exist

        await serverRequest.delete(`${USER_URL}/${v4()}`)
            .expect(ErrorCodes.NOT_FOUND, ErrorMessages.NOT_FOUND);
    })

    it('Should answer with status code 400 and message "Id is invalid (not uuid)"', async () => {
        // Server should answer with status code 400 
        // and message "Id is invalid (not uuid)" if userId is invalid (not uuid)
        await serverRequest.delete(`${USER_URL}/not uuid`)
            .expect(ErrorCodes.BAD_REQUEST, ErrorMessages.INVALID_UUID);
    })

    it('Should answer with status code 400 and message "Id is empty"', async () => {
        // Server should answer with status code 400 
        // and message "Id is empty" if userId is empty
        await serverRequest.delete(`${USER_URL}/`)
            .expect(ErrorCodes.BAD_REQUEST, ErrorMessages.EMPTY_ID);
    })
});

describe("\nPUT api/users/{userId}", () => {
    const updatedUser = {...testUser, age: 21};
    it ('Should answer with status code 200 and updated record', async () => {
        const res = await serverRequest.put(`${USER_URL}/${testDataBase[0].id}`).send(updatedUser);
        expect(res.body.id).toEqual(testDataBase[0].id);
        expect(res.body.age).toEqual(updatedUser.age);
        expect(res.statusCode).toEqual(SuccessCodes.OK);
        expect(res.body).toHaveProperty('username');
        expect(res.body).toHaveProperty('age');
        expect(res.body).toHaveProperty('hobbies');
        expect(res.body).toHaveProperty('id');
    });

    it('Should answer with status code 404 and message "Not found"', async () => {
        // Server should answer with status code 404 
        // and message "Not found" if record with id === userId doesn't exist

        await serverRequest.put(`${USER_URL}/${v4()}`).send(updatedUser)
            .expect(ErrorCodes.NOT_FOUND, ErrorMessages.NOT_FOUND);
    })

    it('Should answer with status code 400 and message "Id is invalid (not uuid)"', async () => {
        // Server should answer with status code 400 
        // and message "Id is invalid (not uuid)" if userId is invalid (not uuid)
        await serverRequest.put(`${USER_URL}/not uuid`).send(updatedUser)
            .expect(ErrorCodes.BAD_REQUEST, ErrorMessages.INVALID_UUID);
    });

    it('Should answer with status code 400 and message "Id is empty"', async () => {
        // Server should answer with status code 400 
        // and message "Id is empty" if userId is empty
        await serverRequest.put(`${USER_URL}/`).send(updatedUser)
            .expect(ErrorCodes.BAD_REQUEST, ErrorMessages.EMPTY_ID);
    });

    it ('Server should answer with status code 400 if body is string', async () => {
        const res = await serverRequest.put(`${USER_URL}/${createdUser.id}`).send('not empty string');
        expect(res.statusCode).toEqual(ErrorCodes.BAD_REQUEST);
    });
    it ('Server should answer with status code 400 if body is empty string', async () => {
        await serverRequest.put(`${USER_URL}/${createdUser.id}`).send('')
            .expect(ErrorCodes.BAD_REQUEST, ErrorMessages.INVALID_BODY);
    });
    it ('Server should answer with status code 400 if body is empty array ', async () => {
        const res = await serverRequest.put(`${USER_URL}/${createdUser.id}`).send([]);
        expect(res.statusCode).toEqual(ErrorCodes.BAD_REQUEST);
    });
    it ('Server should answer with status code 400 if body is empty object', async () => {
        await serverRequest.put(`${USER_URL}/${createdUser.id}`).send({})
            .expect(ErrorCodes.BAD_REQUEST);
    });
    it ('Server should answer with status code 400 if body is null', async () => {
        await serverRequest.put(`${USER_URL}/${createdUser.id}`).send('null')
            .expect(ErrorCodes.BAD_REQUEST, ErrorMessages.INVALID_BODY);
    });

    it ('Server should answer with status code 400 if body does not required age and hobbies ', async () => {
        await serverRequest.put(`${USER_URL}/${createdUser.id}`).send({
            username: 'user'
        })
            .expect(ErrorCodes.BAD_REQUEST);
    });
    it ('Server should answer with status code 400 if body does not required username and hobbies ', async () => {
        await serverRequest.put(`${USER_URL}/${createdUser.id}`).send({
            age: 10
        })
            .expect(ErrorCodes.BAD_REQUEST);
    });
    it ('Server should answer with status code 400 if body does not required username and age ', async () => {
        await serverRequest.put(`${USER_URL}/${createdUser.id}`).send({
            hobbies: ["hobby"]
        })
            .expect(ErrorCodes.BAD_REQUEST);
    });
    it ('Server should answer with status code 400 if body does not required hobbies ', async () => {
        await serverRequest.put(`${USER_URL}/${createdUser.id}`).send({
            username: 'hobbies',
            age: 23,
        })
            .expect(ErrorCodes.BAD_REQUEST);
    });
    it ('Server should answer with status code 400 if body does not required username ', async () => {
        await serverRequest.put(`${USER_URL}/${createdUser.id}`).send({
            age: 23,
            hobbies: []
        })
            .expect(ErrorCodes.BAD_REQUEST);
    });
    it ('Server should answer with status code 400 if body does not required age ', async () => {
        await serverRequest.put(`${USER_URL}/${createdUser.id}`).send({
            username: 23,
            hobbies: []
        })
            .expect(ErrorCodes.BAD_REQUEST);
    });
    it ('Server should answer with status code 400 if body does not correspond to the types ', async () => {
        await serverRequest.put(`${USER_URL}/${createdUser.id}`).send({
            username: 'zheka',
            age: 5,
            hobbies: [1,2,3]
        })
            .expect(ErrorCodes.BAD_REQUEST);
    });
});

describe('\nPATCH, HEAD, OPTIONS api/users', () => {
    it('OPTIONS: Server should answer with status code 500 and message "Server Internal Error"', async () => {
        await serverRequest.options(USER_URL)
            .expect(ErrorCodes.SERVER_ERROR, ErrorMessages.SERVER_INTERNAL);
    })
    it('HEAD: Server should answer with status code 500 and message "undefined"', async () => {
        await serverRequest.head(USER_URL)
            .expect(ErrorCodes.SERVER_ERROR, undefined);
    })
    it('PATCH: Server should answer with status code 500 and message "Server Internal Error"', async () => {
        await serverRequest.patch(USER_URL)
            .expect(ErrorCodes.SERVER_ERROR, ErrorMessages.SERVER_INTERNAL);
    })
});