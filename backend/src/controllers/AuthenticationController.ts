import * as express from "express";
import { injectable, inject } from "inversify";
import * as passport from "passport";
import * as bcrypt from "bcrypt";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import * as jwt from "jwt-simple";
import * as NodeCache from "node-cache";

import { Types } from "src/Types";
import { IDatabaseService } from "src/services/DatabaseService";
import { ILoggerService } from "src/services/LoggerService";
import { IConfigService } from "src/services/ConfigService";
import { IUserController } from "src/controllers/UserController";
import { UserIdentity } from "src/entities/UserIdentity";
import { Actor } from "src/entities/Actor";
import { DatabaseError } from "src/constants/Errors";
import { Time } from "src/constants/Time";
import { NotAuthorizedException } from "src/exceptions/NotAuthorizedException";

export interface AuthenticationCredentials {
  userName: string;
  password: string;
}

export interface IAuthenticationController {
  initialize(): express.Handler;
  authenticate(): express.Handler;
  getTokenAsync(credentials: AuthenticationCredentials): Promise<string>;
  extractUserFromRequestFunction(): (
    req: AuthenticatedRequest,
    res: express.Response,
    next: express.NextFunction
  ) => Promise<void>;
}

@injectable()
export class AuthenticationController implements IAuthenticationController {
  private authenticationCache: NodeCache;

  constructor(
    @inject(Types.DatabaseService)
    private databaseService: IDatabaseService,
    @inject(Types.UserController) private userController: IUserController,
    @inject(Types.Logger) private logger: ILoggerService,
    @inject(Types.ConfigService) private config: IConfigService
  ) {
    const params: StrategyOptions = {
      secretOrKey: config.get("authentication.jwtSecret"),
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer"),
      ignoreExpiration: true
    };

    const strategy = new Strategy(params, async (payload: JWTToken, done) => {
      const cacheKey = this.getCacheKeyFromJWTToken(payload);
      if (!this.authenticationCache.get(cacheKey)) {
        this.logger.debug("Authentication token expired");
        return done(new NotAuthorizedException("Invalid authentication"), null);
      }
      this.logger.debug("Found token from authentication cache");

      const user = await this.userController.getUserAsync({
        guid: payload.guid
      });

      if (user != null) {
        this.logger.debug(`Authentication: Found user in database: ${payload.guid}`);
        return done(null, { guid: user.guid });
      } else {
        this.logger.error(`Authentication: User not found: ${payload.guid}`);
        return done(DatabaseError.UserNotFoundError, null);
      }
    });

    passport.use(strategy);

    this.authenticationCache = new NodeCache();
    this.populateAuthenticationCache();
  }

  public initialize() {
    return passport.initialize();
  }

  public authenticate() {
    return passport.authenticate("jwt", {
      session: this.config.get<boolean>("authentication.jwtSession")
    });
  }

  public extractUserFromRequestFunction(): (
    req: AuthenticatedRequest,
    res: express.Response,
    next: express.NextFunction
  ) => Promise<void> {
    return async (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
      const token = ExtractJwt.fromAuthHeaderWithScheme("Bearer")(req);
      const { guid } = jwt.decode(token, this.config.get("authentication.jwtSecret"));
      const user = await this.userController.getUserAsync({ guid });
      // add authenticated user to the request object for subsequent validation
      req.authenticatedUser = user;
      req.authenticatedActor = user.actor;
      next();
    };
  }

  public async getTokenAsync(credentials: AuthenticationCredentials): Promise<string> {
    try {
      const user = await this.userController.getUserAsync({
        name: credentials.userName
      });

      if (user != null && (await bcrypt.compare(credentials.password, user.passwordHash))) {
        const payload: JWTToken = { guid: user.guid };
        const token = jwt.encode(payload, this.config.get("authentication.jwtSecret"));
        const cacheKey = this.getCacheKeyFromJWTToken(payload);
        await this.addTokenToAuthenticationCache(cacheKey, Time.DAY_MS);
        return token;
      }
    } catch (e) {
      this.logger.error(e);
      return null;
    }
  }

  public getCacheKeyFromJWTToken(payload: JWTToken): string {
    return this.config.get("authentication.cacheKey") + "-" + payload.guid;
  }

  private async populateAuthenticationCache() {
    const keys = await this.databaseService.redis.getKeys();
    this.authenticationCache.flushAll();
    if (keys) {
      keys.forEach(async key => {
        const value = await this.databaseService.redis.getKey(key);
        const expiration = await this.databaseService.redis.getTTL(key);
        this.logger.debug(
          `Populating auth cache from redis: ${key}: ${value}, expiration: ${expiration}`
        );
        this.authenticationCache.set(key, value, expiration);
      });
    }
  }

  private async addTokenToAuthenticationCache(token: string, expiration: number) {
    this.logger.debug(`Setting token to auth cache: ${token}, expiration: ${expiration}`);
    await this.databaseService.redis.set(token, String(expiration), expiration);
    this.authenticationCache.set(token, expiration, expiration);
  }
}

export type AuthenticatedRequest = express.Request & {
  authenticatedUser: UserIdentity;
  authenticatedActor: Actor;
};

interface JWTToken {
  guid: string;
}
