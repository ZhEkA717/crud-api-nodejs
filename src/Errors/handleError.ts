import { RouterCallbackFunc } from "../server/server.types";
import { ErrorCodes } from "../utils/constants";
import { BaseError, NotFoundError, ServerInternalError } from "./customErrors";

export const handleError: RouterCallbackFunc = (_, res, err) => {
    if (err instanceof BaseError) {
        res.statusCode = err.code;
        res.end(err.message);
    } else if (err instanceof SyntaxError) {
        res.statusCode = ErrorCodes.BAD_REQUEST;
        res.end(err.message);
    } else if (err instanceof NotFoundError) {
        res.statusCode = err.code;
        res.end(err.message);
    } else{
        const { code, message } = new ServerInternalError();
        res.statusCode = code;
        res.end(message)
    }
}