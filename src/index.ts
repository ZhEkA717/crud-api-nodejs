import { createServer } from "./server/server";
import { SERVER_PORT } from "./utils/constants";

createServer().listen(SERVER_PORT, () => {
    console.log(`Server running on Port ${SERVER_PORT}`)
});;