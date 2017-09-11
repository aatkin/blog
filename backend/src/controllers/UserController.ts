import { injectable, inject } from "inversify";
import * as uuid from "uuid/v4";
import * as bcrypt from "bcrypt";

import { Types } from "../Types";
import { IDatabaseService } from "../DatabaseService";
import { User, UserParams } from "../entities/User";
import { Role, RoleParams } from "../entities/Role";
import { Actor } from "../models/Actor";
import { NewUser } from "../models/NewUser";
import { Exception } from "../exceptions/Exception";
import { DatabaseException } from "../exceptions/DatabaseException";
import { UserNotFoundException } from "../exceptions/UserNotFoundException";
import { ILogger } from "../utils/Logging";


export interface IUserController
{
    getActorsAsync(): Promise<Actor[]>;
    getActorAsync(userParams: UserParams): Promise<Actor>;
    updateUserAsync(userGuid: string, userParams: UserParams): Promise<Actor>;
    createUserAsync(userParams: UserParams): Promise<Actor>;
}

@injectable()
export class UserController implements IUserController
{
    constructor(@inject(Types.DatabaseService) private databaseService: IDatabaseService,
                @inject(Types.Logger) private logger: ILogger) {}

    public async getActorsAsync(): Promise<Actor[]>
    {
        try
        {
            const userRepository = await this.databaseService.connection.getRepository(User);
            const users = await userRepository.find({
                alias: "user",
                innerJoinAndSelect: {
                    role: "user.role"
                }
            });
            return users.map(Actor.fromUser);
        }
        catch (e)
        {
            this.logger.error(e);
            throw e;
        }
    }

    public async getActorAsync(userParams: UserParams): Promise<Actor>
    {
        try
        {
            const userRepository = await this.databaseService.connection.getRepository(User);
            const queryParams = {
                alias: "user",
                innerJoinAndSelect: {
                    role: "user.role"
                }
            };
            const user = await userRepository.findOne(userParams, queryParams);

            if (user != null)
            {
                return Actor.fromUser(user);
            }

            return null;
        }
        catch (e)
        {
            this.logger.error(e);
            throw e;
        }
    }

    public async updateUserAsync(userGuid: string, userParams: UserParams): Promise<Actor>
    {
        try
        {
            const userRepository = await this.databaseService.connection.getRepository(User);
            const queryParams = {
                alias: "user",
                innerJoinAndSelect: {
                    role: "user.role"
                }
            };
            const user = await userRepository.findOne({ guid: userGuid }, queryParams);

            if (user != null)
            {
                Object.assign(user, userParams);
                await userRepository.persist(user);
                return Actor.fromUser(user);
            }
            else
            {
                throw new UserNotFoundException();
            }
        }
        catch (e)
        {
            this.logger.error(e);

            if (e instanceof UserNotFoundException)
            {
                throw e;
            }
            else
            {
                throw new DatabaseException("Uncaught exception while updating user");
            }
        }
    }

    public async createUserAsync(params: NewUser): Promise<Actor>
    {
        try
        {
            const userRepository = await this.databaseService.connection.getRepository(User);
            const roleRepository = await this.databaseService.connection.getRepository(Role);

            const userParams: UserParams = {
                guid: uuid(),
                password: bcrypt.hashSync(params.password, bcrypt.genSaltSync()),
                isFixture: params.isFixture,
                name: params.name
            };

            let role;

            if (params.roleGuid)
            {
                role = await roleRepository.findOne({ guid: params.roleGuid });
            }
            else
            {
                // default role
                role = await roleRepository.findOne({ guid: "000000-e559-4273-a831-a23009effb7c" });
            }

            Object.assign(userParams, { role });
            const newUser = User.fromParams(userParams);
            await userRepository.persist(newUser);

            return Actor.fromUser(newUser);
        }
        catch (e)
        {
            this.logger.error(e);
            throw new DatabaseException("Uncaught exception while creating user");
        }
    }
}
