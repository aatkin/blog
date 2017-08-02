import { injectable, inject } from "inversify";

import { Types } from "../";
import { IDatabaseService } from "../DatabaseService";
import { User } from "../models";


export interface IUserController
{
    getUsers(): Promise<User[]>;
}

@injectable()
export class UserController implements IUserController
{
    constructor(@inject(Types.DatabaseService) private databaseService: IDatabaseService) {}

    public async getUsers(): Promise<User[]>
    {
        const userRepository = await this.databaseService.connection.getRepository(User);
        const users = await userRepository.find();
        return users;
    }
}
