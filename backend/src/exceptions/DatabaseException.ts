import { Exception } from "./Exception";


export class DatabaseException extends Exception
{
    constructor(message?: string)
    {
        super(message, "DatabaseException");
    }
}
