import { Container } from "inversify";

import { UserController } from "./api";
import { UserRoute, ApiRoute } from "./routes";
import { Logger } from "./utils";
import { DatabaseManager, Server } from "./";


const container = new Container();

// general/utils
container.bind<Logger>(Logger).toSelf().inSingletonScope();
container.bind<DatabaseManager>(DatabaseManager).toSelf().inSingletonScope();

// api
container.bind<UserController>(UserController).toSelf();

// routes
container.bind<UserRoute>(UserRoute).toSelf();
container.bind<ApiRoute>(ApiRoute).toSelf();

export { container };
