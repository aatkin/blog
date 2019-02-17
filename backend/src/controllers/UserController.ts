import { injectable, inject } from "inversify";
import * as uuid from "uuid/v4";
import * as bcrypt from "bcrypt";

import { Types } from "src/Types";
import { IDatabaseService } from "src/services/DatabaseService";
import {
  UserIdentity,
  UserIdentityUpdateParams,
  UserIdentityCreateParams,
  UserIdentityQueryParams
} from "src/entities/UserIdentity";
import { Role } from "src/entities/Role";
import { Actor, ActorQueryParams } from "src/entities/Actor";
import { DatabaseException } from "src/exceptions/DatabaseException";
import { UserNotFoundException } from "src/exceptions/UserNotFoundException";
import { ActorNotFoundException } from "src/exceptions/ActorNotFoundException";
import { RoleNotFoundException } from "src/exceptions/RoleNotFoundException";
import { ValidationException } from "src/exceptions/ValidationException";
import { InternalServerException } from "src/exceptions/InternalServerException";
import { ValidationError } from "src/constants/Errors";
import { Time } from "src/constants/Time";

export interface IUserController {
  getActorsAsync(): Promise<Actor[]>;
  getActorAsync(actorParams: ActorQueryParams): Promise<Actor>;
  getUserAsync(userParams: UserIdentityQueryParams): Promise<UserIdentity>;
  updateUserAsync(userGuid: string, userParams: UserIdentityUpdateParams): Promise<UserIdentity>;
  updateUserPasswordAsync(userGuid: string, password: string): Promise<UserIdentity>;
  createUserAsync(userParams: UserIdentityCreateParams): Promise<UserIdentity>;
}

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(Types.DatabaseService)
    private databaseService: IDatabaseService
  ) {}

  public async getActorsAsync(): Promise<Actor[]> {
    try {
      const actorRepository = await this.databaseService.connection.getRepository(Actor);
      const queryBuilder = await actorRepository.createQueryBuilder("actor");
      const actors =
        queryBuilder
        .innerJoinAndSelect("actor.roles", "role")
        .leftJoinAndSelect("actor.pages", "page")
        .leftJoinAndSelect("page.scopes", "scope")
        .leftJoin("scope.roles", "scope_role")
        .where("scope_role.guid = role.guid")
        .getMany();
      return actors;
    } catch (e) {
      throw InternalServerException.fromError(e);
    }
  }

  public async getUserAsync(userParams: UserIdentityQueryParams): Promise<UserIdentity> {
    try {
      if (userParams.email == null && userParams.guid == null) {
        throw new ValidationException(ValidationError.BadUserGuidOrEmailError);
      }

      const userRepository = await this.databaseService.connection.getRepository(UserIdentity);
      let user;

      if (userParams.guid != null) {
        user = await userRepository
          .createQueryBuilder("user")
          .where("user.guid = :keyword", { keyword: userParams.guid })
          .innerJoinAndSelect("user.actor", "actor")
          .cache(`get_user_${userParams.guid}`, Time.DAY_MS)
          .getOne();
      } else {
        user = await userRepository
          .createQueryBuilder("user")
          .where("user.email LIKE :keyword", {
            keyword: userParams.email
          })
          .innerJoinAndSelect("user.actor", "actor")
          .cache(`get_user_${userParams.email}`, Time.DAY_MS)
          .getOne();
      }

      if (!user) {
        throw new UserNotFoundException();
      }

      return user;
    } catch (e) {
      if (e instanceof UserNotFoundException) {
        throw e;
      } else {
        throw InternalServerException.fromError(e);
      }
    }
  }

  public async getActorAsync(actorParams: ActorQueryParams): Promise<Actor> {
    try {
      if (actorParams.name == null && actorParams.guid == null) {
        throw new ValidationException(ValidationError.BadUserGuidError);
      }

      const actorRepository = await this.databaseService.connection.getRepository(Actor);
      let actor;

      if (actorParams.guid != null) {
        actor = await actorRepository
          .createQueryBuilder("actor")
          .where("actor.guid = :keyword", {
            keyword: actorParams.guid
          })
          .innerJoinAndSelect("actor.roles", "roles")
          .getOne();
      } else {
        actor = await actorRepository
          .createQueryBuilder("actor")
          .where("actor.name LIKE :keyword", {
            keyword: actorParams.name
          })
          .innerJoinAndSelect("actor.roles", "roles")
          .getOne();
      }

      if (!actor) {
        throw new ActorNotFoundException();
      }

      return actor;
    } catch (e) {
      if (e instanceof ActorNotFoundException) {
        throw e;
      } else {
        throw InternalServerException.fromError(e);
      }
    }
  }

  public async updateUserAsync(
    userGuid: string,
    userParams: UserIdentityUpdateParams
  ): Promise<UserIdentity> {
    try {
      if (userGuid == null) {
        throw new ValidationException(ValidationError.BadUserGuidError);
      }
      if (userParams.name == null && userParams.actor == null) {
        throw new ValidationException(ValidationError.BadUpdateParamsError);
      }

      const userRepository = await this.databaseService.connection.getRepository(UserIdentity);
      const user = await userRepository
        .createQueryBuilder("user")
        .where("user.guid = :keyword", { keyword: userGuid })
        .innerJoinAndSelect("user.actor", "actor")
        .getOne();

      if (user == null) {
        throw new UserNotFoundException(userGuid);
      }

      // remove old user cache
      await this.databaseService.clearCacheFor([
        `get_user_${user.guid}`,
        `get_user_${user.name}`
      ]);

      Object.assign(user, userParams);
      await userRepository.save(user);
      return user;
    } catch (e) {
      if (e instanceof UserNotFoundException || e instanceof ValidationException) {
        throw e;
      } else {
        throw InternalServerException.fromError(e);
      }
    }
  }

  public async updateUserPasswordAsync(userGuid: string, password: string): Promise<UserIdentity> {
    try {
      if (password == null || password === "") {
        throw new ValidationException(ValidationError.BadPasswordError);
      }

      const userRepository = await this.databaseService.connection.getRepository(UserIdentity);
      const user = await userRepository
        .createQueryBuilder("user")
        .where("user.guid = :keyword", { keyword: userGuid })
        .innerJoinAndSelect("user.actor", "actor")
        .getOne();

      if (user == null) {
        throw new UserNotFoundException(userGuid);
      }

      user.passwordHash = await bcrypt.hash(password, await bcrypt.genSalt());
      await userRepository.save(user);
      return user;
    } catch (e) {
      if (e instanceof UserNotFoundException || e instanceof ValidationException) {
        throw e;
      }
      throw InternalServerException.fromError(e);
    }
  }

  public async createUserAsync(params: UserIdentityCreateParams): Promise<UserIdentity> {
    try {
      if (params.password == null || params.password === "") {
        throw new ValidationException(ValidationError.BadPasswordError);
      }
      if (params.name == null || params.name === "") {
        throw new ValidationException(ValidationError.BadUserNameError);
      }

      const userRepository = await this.databaseService.connection.getRepository(UserIdentity);
      const actorRepository = await this.databaseService.connection.getRepository(Actor);
      const roleRepository = await this.databaseService.connection.getRepository(Role);

      const guid = uuid();
      const name = params.name;
      const email = params.email;
      const passwordHash = await bcrypt.hash(params.password, await bcrypt.genSalt());
      const isFixture = params.isFixture;

      let actor = params.actor;

      if (actor == null) {
        const role = await roleRepository
          .createQueryBuilder("role")
          .where("role.guid = :keyword", {
            keyword: "000000-e559-4273-a831-a23009effb7c"
          })
          .leftJoinAndSelect("role.actors", "actors")
          .getOne();

        if (!role) {
          throw new RoleNotFoundException();
        }

        actor = new Actor(uuid(), name, [role]);
        actorRepository.save(actor);

        // update actor-role link
        if (role.actors && role.actors.find(a => a.guid === actor!.guid) == null) {
          role.actors.push(actor);
          roleRepository.save(role);
        }
      }

      const newUser = new UserIdentity(guid, name, email, passwordHash, isFixture, actor);
      await userRepository.save(newUser);

      // update actor-user link
      actor.user = newUser;
      actorRepository.save(actor);

      return newUser;
    } catch (e) {
      if (e instanceof ValidationException || e instanceof RoleNotFoundException) {
        throw e;
      } else {
        throw new DatabaseException("Error while creating user");
      }
    }
  }
}
