import { injectable, inject } from "inversify";
import * as express from "express";

import { Types } from "src/Types";
import { IUserRoute } from "src/routes/api/UserRoute";
import { IPageRoute } from "src/routes/api/PageRoute";

export interface IApiRoute {
  router: express.Router;
}

@injectable()
export class ApiRoute {
  public router: express.Router;

  constructor(
    @inject(Types.UserRoute) private userRoute: IUserRoute,
    @inject(Types.PageRoute) private pageRoute: IPageRoute
  ) {
    this.router = express.Router();
    this.attachRoutes();
  }

  protected attachRoutes(): void {
    this.router.use("/user", this.userRoute.router);
    this.router.use("/page", this.pageRoute.router);
  }
}

export * from "./UserRoute";
