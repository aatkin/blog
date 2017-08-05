import { Container, injectable } from "inversify";
import * as express from "express";

import { ILogger, IAuthenticationService } from "../src/utils";
import { Types } from "../src/Types";


@injectable()
export class MockLogger
{
    public error(...args: any[]) { }
    public warn(...args: any[]) { }
    public info(...args: any[]) { }
    public verbose(...args: any[]) { }
    public debug(...args: any[]) { }
    public silly(...args: any[]) { }
}

@injectable()
export class MockAuthenticationService
{
    public initialize(): express.Handler{ return (req, res, next) => { next(); } }
    public authenticate(): express.Handler{ return (req, res, next) => { next(); } }
    public getToken(credentials: any): any {}
}

const container = new Container();

container.bind<ILogger>(Types.Logger).to(MockLogger).inSingletonScope();
container.bind<IAuthenticationService>(Types.AuthenticationService).to(MockAuthenticationService).inSingletonScope();

export { container };
