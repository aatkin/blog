import { injectable } from "inversify";
import * as express from "express";

import { UserRoute } from "./UserRoute";


@injectable()
export class ApiRoute
{
    public router: express.Router;

    constructor(private userRoute: UserRoute)
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
