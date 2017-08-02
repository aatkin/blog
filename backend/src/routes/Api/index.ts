import { injectable, inject } from "inversify";
import * as express from "express";

import { Types } from "../../";
import { IUserRoute } from "./UserRoute";


export interface IApiRoute
{
    router: express.Router;
}

@injectable()
export class ApiRoute
{
    public router: express.Router;

    constructor(@inject(Types.UserRoute) private userRoute: IUserRoute)
    {
        this.router = express.Router();
        this.attachRoutes();
    }

    protected attachRoutes(): void
    {
        // index route handlers
        this.router.get("/", this.getIndex.bind(this));

        // subroute handlers
        this.router.use("/user", this.userRoute.router);
    }

    private getIndex(req: express.Request, res: express.Response, next: express.NextFunction): void
    {
        res.json({ msg: "route: GET /api" });
    }
}

export * from "./UserRoute";
