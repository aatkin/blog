import * as express from "express";
import { injectable, inject } from "inversify";
import * as passport from "passport";
import * as bcrypt from "bcrypt";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import * as jwt from "jwt-simple";
import * as NodeCache from "node-cache";
import * as config from "config";

import { Types } from "../Types";
import { IDatabaseService } from "../services/DatabaseService";
import { ILoggerService } from "../services/LoggerService";
import { UserIdentity, UserIdentityQueryParams } from "../entities/UserIdentity";
import { Actor, ActorQueryParams } from "../entities/Actor";
import { Errors } from "../constants/Errors";
import { Time } from "../constants/Time";


export interface AuthenticationCredentials
{
    userName: string;
    password: string;
}

export interface IAuthenticationController
{
    initialize(): express.Handler;
    authenticate(): express.Handler;
    getTokenAsync(credentials: AuthenticationCredentials): Promise<string>;
    extractUserFromRequestFunction(): (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>;
}

@injectable()
export class AuthenticationController implements IAuthenticationController
{
    private authenticationCache: NodeCache;

    constructor(@inject(Types.DatabaseService) private databaseService: IDatabaseService,
                @inject(Types.Logger) private logger: ILoggerService)
    {
        this.authenticationCache = new NodeCache();

        const params: StrategyOptions = {
            secretOrKey: config.get("authentication.jwtSecret"),
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer")
        };

        const strategy = new Strategy(params, async (payload, done) =>
        {
            if (this.authenticationCache.get<string>(payload.guid))
            {
                this.logger.debug("Authentication: Found user in cache:", payload.guid);
                return done(null, { guid: payload.guid });
            }

            const user = await this.getUserAsync({ guid: payload.guid });

            if (user)
            {
                this.logger.debug("Authentication: Found user in database:", payload.guid);
                this.authenticationCache.set<string>(user.guid, user.name);
                return done(null, { guid: user.guid });
            }
            else
            {
                this.logger.error("Authentication: User not found:", payload.guid);
                return done(Errors.UserNotFound, null);
            }
        });

        passport.use(strategy);
    }

    public initialize()
    {
        return passport.initialize();
    }

    public authenticate()
    {
        return passport.authenticate("jwt", { session: config.get<boolean>("authentication.jwtSession") });
    }

    public extractUserFromRequestFunction(): (req: express.Request, res: express.Response, next: express.NextFunction) => Promise<void>
    {
        return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const token = ExtractJwt.fromAuthHeaderWithScheme("Bearer")(req);
            const { guid } = jwt.decode(token, config.get<string>("authentication.jwtSecret"));
            const actor = await this.getActorAsync({ guid });
            (req as any).authenticatedUser = actor;
            next();
        };
    }

    public async getTokenAsync(credentials: AuthenticationCredentials): Promise<string>
    {
        const user = await this.getUserAsync({ name: credentials.userName });

        if (user && await bcrypt.compare(credentials.password, user.passwordHash))
        {
            // jwt expiration token is recognized by passport-jwt
            const expiration = Date.now() + (30 * Time.MINUTE_MS);
            const payload = { guid: user.guid, exp: expiration };
            const token = jwt.encode(payload, config.get("authentication.jwtSecret"));
            return token;
        }

        return null;
    }

    private async getUserAsync(userParams: UserIdentityQueryParams): Promise<UserIdentity>
    {
        try
        {
            const userRepository = await this.databaseService.connection.getRepository(UserIdentity);
            const user = await userRepository
                .createQueryBuilder("user")
                .where("user.guid = :keyword", { keyword: userParams.guid })
                .innerJoinAndSelect("user.actor", "actor")
                .getOne();
            return user;
        }
        catch (e)
        {
            this.logger.error(e);
            throw e;
        }
    }

    private async getActorAsync(actorParams: ActorQueryParams): Promise<Actor>
    {
        try
        {
            const actorRepository = await this.databaseService.connection.getRepository(Actor);
            const user = await actorRepository
                .createQueryBuilder("actor")
                .where("actor.guid = :keyword", { keyword: actorParams.guid })
                .innerJoinAndSelect("actor.user", "user")
                .getOne();
            return user;
        }
        catch (e)
        {
            this.logger.error(e);
            throw e;
        }
    }
}
