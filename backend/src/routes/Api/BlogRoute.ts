import * as express from "express";

import { Route } from "../Route";


export class BlogRoute extends Route
{
    protected attachRoutes(router: express.Router): void
    {
        router.get("/", this.getBlog.bind(this));
        router.get("/test", (req, res, next) => { res.json({ msg: "route: api/blog/test" }); });
    }

    private getBlog(req: express.Request, res: express.Response, next: express.NextFunction): void
    {
        res.json({ msg: "route: api/blog" });
    }
}
