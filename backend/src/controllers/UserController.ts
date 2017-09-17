import { injectable, inject } from "inversify";
import * as uuid from "uuid/v4";
import * as bcrypt from "bcrypt";

import { Types } from "../Types";
import { IDatabaseService } from "../services/DatabaseService";
import { ILoggerService } from "../services/LoggerService";
import { UserIdentity, UserIdentityUpdateParams, UserIdentityCreateParams, UserIdentityQueryParams } from "../entities/UserIdentity";
import { Role } from "../entities/Role";
import { Actor, ActorQueryParams } from "../entities/Actor";
import { DatabaseException } from "../exceptions/DatabaseException";
import { UserNotFoundException } from "../exceptions/UserNotFoundException";


export interface IUserController
{
    getActorsAsync(): Promise<Actor[]>;
    getActorAsync(actorParams: ActorQueryParams): Promise<Actor>;
    getUserAsync(userParams: UserIdentityQueryParams): Promise<UserIdentity>;
    updateUserAsync(userGuid: string, userParams: UserIdentityUpdateParams): Promise<UserIdentity>;
    updateUserPasswordAsync(userGuid: string, password: string): Promise<UserIdentity>;
    createUserAsync(userParams: UserIdentityCreateParams): Promise<UserIdentity>;
}

@injectable()
export class UserController implements IUserController
{
    constructor(@inject(Types.DatabaseService) private databaseService: IDatabaseService,
                @inject(Types.Logger) private logger: ILoggerService) {}

    public async getActorsAsync(): Promise<Actor[]>
    {
        try
        {
            const actorRepository = await this.databaseService.connection.getRepository(Actor);
            const actors = await actorRepository
                .createQueryBuilder("actor")
                .innerJoinAndSelect("user.role", "role")
                .getMany();
            return actors;
        }
        catch (e)
        {
            this.logger.error(e);
            throw e;
        }
    }

    public async getUserAsync(userParams: UserIdentityQueryParams): Promise<UserIdentity>
    {
        try
        {
            const userRepository = await this.databaseService.connection.getRepository(UserIdentity);
            let user;

            if (userParams.guid != null)
            {
                user = await userRepository
                    .createQueryBuilder("user")
                    .where("user.guid = :keyword", { keyword: userParams.guid })
                    .innerJoinAndSelect("user.actor", "actor")
                    .getOne();
            }
            else
            {
                user = await userRepository
                    .createQueryBuilder("user")
                    .where("user.name LIKE :keyword", { keyword: userParams.name })
                    .innerJoinAndSelect("user.actor", "actor")
                    .getOne();
            }

            return user;
        }
        catch (e)
        {
            this.logger.error(e);
            throw e;
        }
    }

    public async getActorAsync(actorParams: ActorQueryParams): Promise<Actor>
    {
        try
        {
            const actorRepository = await this.databaseService.connection.getRepository(Actor);

            let actor;

            if (actorParams.guid != null)
            {
                actor = await actorRepository
                    .createQueryBuilder("actor")
                    .where("actor.guid = :keyword", { keyword: actorParams.guid })
                    .innerJoinAndSelect("actor.role", "role")
                    .getOne();
            }
            else
            {
                actor = await actorRepository
                    .createQueryBuilder("actor")
                    .where("actor.name LIKE :keyword", { keyword: actorParams.name })
                    .innerJoinAndSelect("actor.role", "role")
                    .getOne();
            }

            return actor;
        }
        catch (e)
        {
            this.logger.error(e);
            throw e;
        }
    }

    public async updateUserAsync(userGuid: string, userParams: UserIdentityUpdateParams): Promise<UserIdentity>
    {
        try
        {
            const userRepository = await this.databaseService.connection.getRepository(UserIdentity);
            const user = await userRepository
                .createQueryBuilder("user")
                .where("user.guid = :keyword", { keyword: userGuid })
                .innerJoinAndSelect("user.actor", "actor")
                .getOne();

            if (user != null)
            {
                Object.assign(user, userParams);
                await userRepository.persist(user);
                return user;
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
                throw new DatabaseException("Error while updating user");
            }
        }
    }

    public async updateUserPasswordAsync(userGuid: string, password: string): Promise<UserIdentity>
    {
        try
        {
            const userRepository = await this.databaseService.connection.getRepository(UserIdentity);
            const user = await userRepository
                .createQueryBuilder("user")
                .where("user.guid = :keyword", { keyword: userGuid })
                .innerJoinAndSelect("user.actor", "actor")
                .getOne();

            if (user != null)
            {
                user.passwordHash = await bcrypt.hash(password, await bcrypt.genSalt());
                await userRepository.persist(user);
                return user;
            }
            else
            {
                throw new UserNotFoundException(userGuid);
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
                throw new DatabaseException("Error while updating user");
            }
        }
    }

    public async createUserAsync(params: UserIdentityCreateParams): Promise<UserIdentity>
    {
        try
        {
            const userRepository = await this.databaseService.connection.getRepository(UserIdentity);
            const actorRepository = await this.databaseService.connection.getRepository(Actor);

            const guid = uuid();
            const name = params.name;
            const passwordHash = await bcrypt.hash(params.password, await bcrypt.genSalt());
            const isFixture = params.isFixture;

            let actor;

            if (!params.actor)
            {
                // default actor
                actor = await actorRepository.findOne({ guid: "000000-e559-4273-a831-a23009effb7c" });
            }

            const newUser = new UserIdentity(guid, name, passwordHash, isFixture, actor);
            await userRepository.persist(newUser);

            return newUser;
        }
        catch (e)
        {
            this.logger.error(e);
            throw new DatabaseException("Error while creating user");
        }
    }
}
