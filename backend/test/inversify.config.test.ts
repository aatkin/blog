import { Container, injectable } from "inversify";
import * as express from "express";

import { ILoggerService } from "../src/services/LoggerService";
import { IAuthenticationController } from "../src/controllers/AuthenticationController";
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
export class MockAuthenticationController
{
    public initialize(): express.Handler { return (req, res, next) => { next(); }; }
    public authenticate(): express.Handler { return (req, res, next) => { next(); }; }
    public getTokenAsync(credentials: any): any {}
    public extractUserFromRequestFunction(): any {}
}

const container = new Container();

container.bind<ILoggerService>(Types.Logger).to(MockLogger).inSingletonScope();
container.bind<IAuthenticationController>(Types.AuthenticationController).to(MockAuthenticationController).inSingletonScope();

export { container };
