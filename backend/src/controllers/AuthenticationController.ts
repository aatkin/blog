import * as express from "express";
import { injectable, inject } from "inversify";
import * as passport from "passport";
import * as bcrypt from "bcrypt";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import * as jwt from "jwt-simple";
import * as config from "config";

import { Types } from "../Types";
import { IDatabaseService } from "../services/DatabaseService";
import { ILoggerService } from "../services/LoggerService";
import { IUserController } from "./UserController";
import { UserIdentity, UserIdentityQueryParams } from "../entities/UserIdentity";
import { Actor, ActorQueryParams } from "../entities/Actor";
import { DatabaseException } from "../exceptions/DatabaseException";
import { Exception } from "../exceptions/Exception";
import { DatabaseError } from "../constants/Errors";
import { Time } from "../constants/Time";

export interface AuthenticationCredentials {
  userName: string;
  password: string;
}

export interface IAuthenticationController {
  initialize(): express.Handler;
  authenticate(): express.Handler;
  getTokenAsync(credentials: AuthenticationCredentials): Promise<string>;
  extractUserFromRequestFunction(): (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => Promise<void>;
}

@injectable()
export class AuthenticationController implements IAuthenticationController {
  constructor(
    @inject(Types.DatabaseService)
    private databaseService: IDatabaseService,
    @inject(Types.UserController) private userController: IUserController,
    @inject(Types.Logger) private logger: ILoggerService
  ) {
    const params: StrategyOptions = {
      secretOrKey: config.get("authentication.jwtSecret"),
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("Bearer")
    };

    const strategy = new Strategy(params, async (payload, done) => {
      const user = await this.userController.getUserAsync({
        guid: payload.guid
      });

      if (user != null) {
        this.logger.debug("Authentication: Found user in database:", payload.guid);
        return done(null, { guid: user.guid });
      } else {
        this.logger.error("Authentication: User not found:", payload.guid);
        return done(DatabaseError.UserNotFoundError, null);
      }
    });

    passport.use(strategy);
  }

  public initialize() {
    return passport.initialize();
  }

  public authenticate() {
    return passport.authenticate("jwt", {
      session: config.get<boolean>("authentication.jwtSession")
    });
  }

  public extractUserFromRequestFunction(): (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => Promise<void> {
    return async (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
      const token = ExtractJwt.fromAuthHeaderWithScheme("Bearer")(req);
      const { guid } = jwt.decode(token, config.get<string>("authentication.jwtSecret"));
      const user = await this.userController.getUserAsync({ guid });
      // add authenticated user to the request object for subsequent validation
      req.authenticatedUser = user;
      req.authenticatedActor = user.actor;
      next();
    };
  }

  public async getTokenAsync(credentials: AuthenticationCredentials): Promise<string> {
    const user = await this.userController.getUserAsync({
      name: credentials.userName
    });

    if (user != null && (await bcrypt.compare(credentials.password, user.passwordHash))) {
      // jwt expiration token is recognized by passport-jwt
      const expiration = Date.now() + 30 * Time.MINUTE_MS;
      const payload = { guid: user.guid, exp: expiration };
      const token = jwt.encode(payload, config.get("authentication.jwtSecret"));
      return token;
    }

    return null;
  }
}

export type AuthenticatedRequest = express.Request & {
  authenticatedUser: UserIdentity;
  authenticatedActor: Actor;
};
