import { injectable, inject } from "inversify";
import * as express from "express";

import { Types } from "../../";
import { IUserController } from "../../api";


export interface IUserRoute
{
    router: express.Router;
}

@injectable()
export class UserRoute implements IUserRoute
{
    public router: express.Router;

    constructor(@inject(Types.UserController) private userController: IUserController)
    {
        this.router = express.Router();
        this.attachRoutes();
    }

    private attachRoutes(): void
    {
        this.router.get("/", this.getUser.bind(this));
        this.router.get("/update", this.updateUser.bind(this));
        this.router.get("/create", this.createUser.bind(this));
        this.router.get("/test", this.getAllUsers.bind(this));
    }

    private async getAllUsers(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        const users = await this.userController.getUsers();
        res.json({ users });
    }

    private async getUser(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        const user = await this.userController.getUser(req.body.user);
        res.json({ user });
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
