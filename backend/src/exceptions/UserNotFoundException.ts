import { Exception } from "./Exception";


export class UserNotFoundException extends Exception
{
    constructor(message?: string)
    {
        super(message, "UserNotFoundException");
    }
}
