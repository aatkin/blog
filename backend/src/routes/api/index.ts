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

  constructor(@inject(Types.UserRoute) private userRoute: IUserRoute, @inject(Types.PageRoute) private pageRoute: IPageRoute) {
    this.router = express.Router();
    this.attachRoutes();
  }

  protected attachRoutes(): void {
    // index route handlers
    this.router.get("/", this.getIndex.bind(this));

    // subroute handlers
    this.router.use("/user", this.userRoute.router);
    this.router.use("/page", this.userRoute.router);
  }

  private getIndex(req: express.Request, res: express.Response, next: express.NextFunction): void {
    const routes = [this.userRoute.getRouteInformation(), this.pageRoute.getRouteInformation()];
    res.json({ routes });
  }
}

export * from "./UserRoute";
