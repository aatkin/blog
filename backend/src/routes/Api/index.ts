import * as express from "express";

import { Route } from "../Route";
import { BlogRoute } from "./BlogRoute";


export class ApiRoute extends Route
{
    protected attachRoutes(router: express.Router): void
    {
        // index route handlers
        router.get("/", this.getIndex.bind(this));

        // subroute handlers
        router.use("/blog", new BlogRoute().router);
    }

    private getIndex(req: express.Request, res: express.Response, next: express.NextFunction): void
    {
        res.json({ msg: "route: api/" });
    }
}
