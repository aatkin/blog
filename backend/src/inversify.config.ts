import { Container } from "inversify";

import { IUserController, UserController } from "./controllers/UserController";
import { IAuthenticationController, AuthenticationController } from "./controllers/AuthenticationController";
import { IUserRoute, UserRoute, IApiRoute, ApiRoute } from "./routes";
import { ILogger, Logger } from "./utils/Logging";
import { IDatabaseService, DatabaseService } from "./DatabaseService";

import { Types } from "./Types";


const container = new Container();

// general/utils
container.bind<ILogger>(Types.Logger).to(Logger).inSingletonScope();
container.bind<IDatabaseService>(Types.DatabaseService).to(DatabaseService).inSingletonScope();
container.bind<IAuthenticationController>(Types.AuthenticationController).to(AuthenticationController).inSingletonScope();

// api
container.bind<IUserController>(Types.UserController).to(UserController);

// routes
container.bind<IUserRoute>(Types.UserRoute).to(UserRoute);
container.bind<IApiRoute>(Types.ApiRoute).to(ApiRoute);

export { container };
