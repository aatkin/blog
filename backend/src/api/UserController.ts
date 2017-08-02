import { injectable } from "inversify";

import { DatabaseManager } from "../DatabaseManager";
import { User } from "../models";


@injectable()
export class UserController
{
    constructor(private databaseService: DatabaseManager) {}

    public async getUsers(): Promise<User[]>
    {
        const userRepository = await this.databaseService.connection.getRepository(User);
        const users = await userRepository.find();
        return users;
    }
}
