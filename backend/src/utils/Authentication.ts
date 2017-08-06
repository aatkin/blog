import * as express from "express";
import { injectable, inject } from "inversify";
import * as passport from "passport";
import * as bcrypt from "bcrypt";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import * as jwt from "jwt-simple";
import * as config from "config";

import { Types } from "../Types";
import { IUserController } from "../api";


export interface AuthenticationCredentials
{
    userName: string;
    password: string;
}

export interface IAuthenticationService
{
    initialize(): express.Handler;
    authenticate(): express.Handler;
    getToken(credentials: AuthenticationCredentials): Promise<string>;
}

@injectable()
export class AuthenticationService implements IAuthenticationService
{
    constructor(@inject(Types.UserController) private userController: IUserController)
    {
        const params: StrategyOptions = {
            secretOrKey: config.get("authentication.jwtSecret"),
            jwtFromRequest: ExtractJwt.fromAuthHeader()
        };

        const strategy = new Strategy(params, async (payload, done) =>
        {
            const user = await userController.getUser({ guid: payload.guid });

            if (user)
            {
                return done(null, { guid: user.guid });
            }
            else
            {
                return done(new Error("User not found"), null);
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

    public async getToken(credentials: AuthenticationCredentials): Promise<string>
    {
        const user = await this.userController.getUser({ name: credentials.userName });

        if (user && await bcrypt.compare(credentials.password, user.password))
        {
            const payload = { guid: user.guid };
            const token = jwt.encode(payload, config.get("authentication.jwtSecret"));
            return token;
        }

        return null;
    }
}
