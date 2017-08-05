import * as express from "express";
import { injectable, inject } from "inversify";
import * as passport from "passport";
import * as bcrypt from "bcrypt";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import * as jwt from "jwt-simple";
import * as config from "config";

import { getUserFixtures } from "./Fixtures";
import { Types } from "../Types";
import { IDatabaseService } from "../DatabaseService";


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
    constructor(@inject(Types.DatabaseService) private databaseService: IDatabaseService)
    {
        const params: StrategyOptions = {
            secretOrKey: config.get("authentication.jwtSecret"),
            jwtFromRequest: ExtractJwt.fromAuthHeader()
        };

        const strategy = new Strategy(params, async (payload, done) =>
        {
            // fixture use only
            const users = await getUserFixtures(databaseService.connection);
            const user = users.find(x => x.guid === payload.guid);

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
        const users = await getUserFixtures(this.databaseService.connection);
        const user = users.find(user => user.name === credentials.userName);

        if (user && await bcrypt.compare(credentials.password, user.password))
        {
            const payload = { guid: user.guid };
            const token = jwt.encode(payload, config.get("authentication.jwtSecret"));
            return token;
        }

        return null;
    }
}
