import { envConfig } from "../common/config";
import http from 'http';


type Users = {
    id: number,
    username: string,
    age: number,
    hobbies: string[],
} 

const users = [
    {
        id: 1,
        username: 'Zheka',
        age: 23,
        hobbies: ['football']
    }
];

export const createServer = (port = envConfig.SERVER_PORT) => {
    const server = http.createServer((req, res) => {
        console.log(req.method);
        console.log(req.url);
        res.end();
    });
    
    server.listen(port, () => {
        console.log(`Server running on Port ${port}`)
    })
}



