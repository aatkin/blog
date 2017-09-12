import { Exception } from "./Exception";


export class UnknownContentNodeException extends Exception
{
    constructor(message?: string)
    {
        super(message, "UnknownContentNodeException");
    }
}
