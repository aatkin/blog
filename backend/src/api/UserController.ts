import { injectable, inject } from "inversify";

import { Types } from "../";
import { IDatabaseService } from "../DatabaseService";
import { User, UserParams } from "../models";


export interface IUserController
{
    getUsers(): Promise<User[]>;
    getUser(userParams: UserParams): Promise<User>;
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

    public async getUser(userParams: UserParams): Promise<User>
    {
        const userRepository = await this.databaseService.connection.getRepository(User);
        const user = await userRepository.findOne(userParams);
        return user;
    }
}
