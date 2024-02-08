import { ServerResponse } from "http";
import { IRequest } from "./server.interfaces";

export type RouterCallbackFunc = (req: IRequest, res: ServerResponse, err?: unknown) => void;

export type MethodType = 'GET' | 'PUT' | 'POST' | 'DELETE';
