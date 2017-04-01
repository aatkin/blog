import * as express from "express";
import { IRoute } from "./IRoute";

export class ApiRoute implements IRoute {
    public router: express.Router;

    constructor() {
        this.router = express.Router();
        this.router.get("/blog", this.getBlog.bind(this));
    }

    private getBlog(req: express.Request, res: express.Response, next: express.NextFunction): void {
        res.json({ msg: "Not implemented yet, fool!" });
    }
}
