import * as express from "express";

import { Route } from "../Route";
import { UserController } from "../../api";


export class UserRoute extends Route
{
    protected attachRoutes(router: express.Router): void
    {
        router.get("/", this.getUser.bind(this));
        router.get("/update", this.updateUser.bind(this));
        router.get("/create", this.createUser.bind(this));
        router.get("/test", this.getAllUsers.bind(this));
    }

    private async getAllUsers(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        const controller = new UserController();
        const users = await controller.getUsers();
        res.json({ msg: "route: GET /api/user", users });
    }

    private async getUser(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        res.json({ msg: "route: GET /api/user" });
    }

    private async updateUser(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        res.json({ msg: "route: POST /api/user/update" });
    }

    private async createUser(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        res.json({ msg: "route: POST /api/user/create" });
    }
}
