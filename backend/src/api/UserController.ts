import { DatabaseManager } from "../DatabaseManager";
import { User } from "../models";


export class UserController
{
    public async getUsers(): Promise<User[]>
    {
        const userRepository = await DatabaseManager.connection.getRepository(User);
        const users = await userRepository.find();
        return users;
    }
}
