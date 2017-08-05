import { Container } from "inversify";

import { IUserController, UserController } from "./api";
import { IUserRoute, UserRoute, IApiRoute, ApiRoute } from "./routes";
import { ILogger, Logger, IAuthenticationService, AuthenticationService } from "./utils";
import { IDatabaseService, DatabaseService } from "./DatabaseService";

import { Types } from "./Types";


const container = new Container();

// general/utils
container.bind<ILogger>(Types.Logger).to(Logger).inSingletonScope();
container.bind<IDatabaseService>(Types.DatabaseService).to(DatabaseService).inSingletonScope();
container.bind<IAuthenticationService>(Types.AuthenticationService).to(AuthenticationService).inSingletonScope();

// api
container.bind<IUserController>(Types.UserController).to(UserController);

// routes
container.bind<IUserRoute>(Types.UserRoute).to(UserRoute);
container.bind<IApiRoute>(Types.ApiRoute).to(ApiRoute);

export { container };
