import { Role } from "../entities/Role";
import { User } from "../entities/User";


export class Actor
{
    constructor(public guid: string, public name: string, public role: Role) {}

    public static fromUser(user: User): Actor
    {
        const { guid, name, role } = user;
        return new Actor(guid, name, role);
    }
}
