import * as express from "express";

import { Route } from "../Route";
import { UserRoute } from "./UserRoute";


export class ApiRoute extends Route
{
    protected attachRoutes(router: express.Router): void
    {
        // index route handlers
        router.get("/", this.getIndex.bind(this));

        // subroute handlers
        router.use("/user", new UserRoute().router);
    }

    private getIndex(req: express.Request, res: express.Response, next: express.NextFunction): void
    {
        res.json({ msg: "route: GET /api" });
    }
}
