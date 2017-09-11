import { injectable, inject } from "inversify";
import * as express from "express";

import { Types } from "../../Types";
import { IUserController } from "../../controllers/UserController";
import { ILoggerService } from "../../services/LoggerService";
import { ValidationException } from "../../exceptions/ValidationException";
import { DatabaseException } from "../../exceptions/DatabaseException";
import { UserNotFoundException } from "../../exceptions/UserNotFoundException";
import { UserParams } from "../../entities/User";
import { Errors } from "../../constants/Errors";


export interface IUserRoute
{
    router: express.Router;
    getRouteInformation(): any;
}

@injectable()
export class UserRoute implements IUserRoute
{
    public router: express.Router;

    constructor(@inject(Types.UserController) private userController: IUserController,
                @inject(Types.Logger) private logger: ILoggerService)
    {
        this.router = express.Router();
        this.attachRoutes();
    }

    public getRouteInformation(): any
    {
        return {
            route: "user",
            routes: [
                { method: "GET", url: "/" },
                { method: "POST", url: "/", params: "user" },
                { method: "POST", url: "/update", params: "user" },
                { method: "POST", url: "/create", params: "user" }
            ]
        };
    }

    private attachRoutes(): void
    {
        this.router.get("/", this.getAllActors.bind(this));
        this.router.post("/", this.validateBody, this.getActor.bind(this));
        this.router.post("/update", this.validateBody, this.updateUser.bind(this));
        this.router.post("/create", this.validateBody, this.createUser.bind(this));
    }

    private validateBody(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        if (!req.body)
        {
            // return next(new ValidationException("Request body is null or undefined"));
            return res.status(400).json({ error: "Request body is null or undefined" });
        }
        if (!req.body.user || typeof req.body.user !== "object")
        {
            // return next(new ValidationException("Request body must include user object"));
            return res.status(400).json({ error: "Request body must include user object" });
        }

        next();
    }

    private async getAllActors(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        try
        {
            const actors = await this.userController.getActorsAsync();
            res.json({ actors });
        }
        catch (e)
        {
            next(e);
        }
    }

    private async getActor(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        const { name } = <UserParams>(req.body.user);

        if (name == null)
        {
            // return next(new ValidationException("Parameter 'name' is null or undefined"));
            return res.status(400).json({ error: "Parameter 'name' is null or undefined" });
        }

        try
        {
            const actor = await this.userController.getActorAsync({ name });
            return res.json({ actor });
        }
        catch (e)
        {
            next(e);
        }
    }

    private async updateUser(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        const { guid, name, password, role } = <UserParams>(req.body.user);

        if (guid == null)
        {
            // return next(new ValidationException("User guid is null or undefined"));
            return res.status(400).json({ error: "User guid is null or undefined" });
        }

        if (name == null && password == null && role == null)
        {
            // return next(new ValidationException("All parameters are null or undefined"));
            return res.status(400).json({ error: "All parameters are null or undefined" });
        }

        try
        {
            const changeSet = {};
            if (name != null) { Object.assign(changeSet, { name }); }
            if (password != null) { Object.assign(changeSet, { password }); }
            if (role != null) { Object.assign(changeSet, { role }); }

            const actor = await this.userController.updateUserAsync(guid, changeSet);
            res.json({ actor });
        }
        catch (e)
        {
            if (e instanceof UserNotFoundException)
            {
                return res.status(400).send({ error: Errors.UserNotFound });
            }

            next(e);
        }
    }

    private async createUser(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        res.json({ msg: "route: POST /api/user/create" });
    }
}
