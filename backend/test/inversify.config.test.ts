import { Container, injectable } from "inversify";
import * as express from "express";

import { ILoggerService } from "src/services/LoggerService";
import { IAuthenticationController } from "src/controllers/AuthenticationController";
import { Types } from "src/Types";

@injectable()
export class MockLogger implements ILoggerService {
  public error(message: string) {}
  public warn(message: string) {}
  public info(message: string) {}
  public verbose(message: string) {}
  public debug(message: string) {}
  public silly(message: string) {}
  public logException(e: Error) {}
}

@injectable()
export class MockAuthenticationController {
  public initialize(): express.Handler {
    return (req, res, next) => {
      next();
    };
  }
  public authenticate(): express.Handler {
    return (req, res, next) => {
      next();
    };
  }
  public getTokenAsync(credentials: any): any {}
  public extractUserFromRequestFunction(): any {}
}

const container = new Container();

container
  .bind<ILoggerService>(Types.Logger)
  .to(MockLogger)
  .inSingletonScope();
container
  .bind<IAuthenticationController>(Types.AuthenticationController)
  .to(MockAuthenticationController)
  .inSingletonScope();

export { container };
