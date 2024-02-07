import { IncomingMessage } from "http";
import { CreateUser } from "../services/user.model";

export interface IRequest extends IncomingMessage {
    body?: CreateUser;
}