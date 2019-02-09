import { Container } from "inversify";

import { IUserController, UserController } from "./controllers/UserController";
import { IPageController, PageController } from "./controllers/PageController";
import { IAuthenticationController, AuthenticationController } from "./controllers/AuthenticationController";
import { IApiRoute, ApiRoute } from "./routes";
import { IUserRoute, UserRoute } from "./routes/api/UserRoute";
import { IPageRoute, PageRoute } from "./routes/api/PageRoute";
import { ILoggerService, LoggerService } from "./services/LoggerService";
import { IDatabaseService, DatabaseService } from "./services/DatabaseService";

import { Types } from "./Types";

const container = new Container();

// general/utils
container
  .bind<ILoggerService>(Types.Logger)
  .to(LoggerService)
  .inSingletonScope();
container
  .bind<IDatabaseService>(Types.DatabaseService)
  .to(DatabaseService)
  .inSingletonScope();
container
  .bind<IAuthenticationController>(Types.AuthenticationController)
  .to(AuthenticationController)
  .inSingletonScope();

// api
container.bind<IUserController>(Types.UserController).to(UserController);
container.bind<IPageController>(Types.PageController).to(PageController);

// routes
container.bind<IApiRoute>(Types.ApiRoute).to(ApiRoute);
container.bind<IUserRoute>(Types.UserRoute).to(UserRoute);
container.bind<IPageRoute>(Types.PageRoute).to(PageRoute);

export { container };
