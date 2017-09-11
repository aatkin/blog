import { Role } from "../entities/Role";
import { User } from "../entities/User";
import { Page } from "../entities/Page";


export class Actor
{
    constructor(public guid: string, public name: string, public role: Role, public pages: Page[]) {}

    public static fromUser(user: User): Actor
    {
        const { guid, name, role, pages } = user;
        return new Actor(guid, name, role, pages);
    }
}
