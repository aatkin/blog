import { Container } from "inversify";

import { IUserController, UserController } from "src/controllers/UserController";
import { IPageController, PageController } from "src/controllers/PageController";
import {
  IAuthenticationController,
  AuthenticationController
} from "src/controllers/AuthenticationController";
import { IApiRoute, ApiRoute } from "src/routes/api/index";
import { IUserRoute, UserRoute } from "src/routes/api/UserRoute";
import { IPageRoute, PageRoute } from "src/routes/api/PageRoute";
import { ILoggerService, LoggerService } from "src/services/LoggerService";
import { IDatabaseService, DatabaseService } from "src/services/DatabaseService";
import { IConfigService, ConfigService } from "src/services/ConfigService";

import { Types } from "src/Types";

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
  .bind<IConfigService>(Types.ConfigService)
  .to(ConfigService)
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
