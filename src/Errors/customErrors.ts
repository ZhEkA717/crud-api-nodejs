export const enum ErrorCodes {
    'BAD_REQUEST' = 400,
    'NOT_FOUND' = 404,
    'SERVER_ERROR' = 500,
}

export const enum ErrorMessages {
    BAD_REQUEST = 'Bad Request',
    NOT_FOUND = 'Not Found',
    SERVER_INTERNAL = 'Server Internal Error',
    NOT_FOUND_ENDPOINT = 'NOT FOUND ENDPOINT',
    INVALID_BODY = 'Invalid requests body',
    EMPTY_ID = 'Id is empty',
    INVALID_UUID = 'Id is invalid (not uuid)'
}

export class BaseError extends Error {
    message: string;
    code: number;

    constructor(message: string, code: number = ErrorCodes.SERVER_ERROR) {
        super(message);
        this.message = message;
        this.code = code;
    }
}

export class NotFoundError extends BaseError {
    constructor(message: string = ErrorMessages.NOT_FOUND) {
        super(message, ErrorCodes.NOT_FOUND);
    }
}

export class NotFoundEndpointError extends BaseError {
    constructor(message: string = ErrorMessages.NOT_FOUND_ENDPOINT) {
        super(message, ErrorCodes.NOT_FOUND);
    }
}

export class InvalidIdUUIDError extends BaseError {
    constructor(id: string) {
        id === '' 
            ? super(ErrorMessages.EMPTY_ID, ErrorCodes.BAD_REQUEST)
            : super(ErrorMessages.INVALID_UUID, ErrorCodes.BAD_REQUEST);
    }
}

export class InvalidBodyError extends BaseError {
    constructor(message: string = ErrorMessages.INVALID_BODY) {
        super(message, ErrorCodes.BAD_REQUEST);
    }
}

export class UserBadRequestError extends BaseError {
    constructor(field: string | string[] | number) {
        super(
            `${ErrorMessages.BAD_REQUEST}\nRequest body does't contain required field "${field}" or type of field invalid`,
            ErrorCodes.BAD_REQUEST
        );
    }
}

export class ServerInternalError extends BaseError {
    constructor(message: string = ErrorMessages.SERVER_INTERNAL) {
        super(message, ErrorCodes.SERVER_ERROR);
    }
} 