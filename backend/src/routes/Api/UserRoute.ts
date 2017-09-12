import { injectable, inject } from "inversify";
import * as express from "express";

import { Types } from "../../Types";
import { IUserController } from "../../controllers/UserController";
import { ILoggerService } from "../../services/LoggerService";
import { ValidationException } from "../../exceptions/ValidationException";
import { DatabaseException } from "../../exceptions/DatabaseException";
import { UserNotFoundException } from "../../exceptions/UserNotFoundException";
import { UserIdentityQueryParams, UserIdentityUpdateParams } from "../../entities/UserIdentity";
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
        this.router.get("/", this.getAllActorsAsync.bind(this));
        this.router.post("/", this.validateBody, this.getActorAsync.bind(this));
        this.router.post("/update", this.validateBody, this.updateUserAsync.bind(this));
        this.router.post("/create", this.validateBody, this.createUserAsync.bind(this));
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

    private async getAllActorsAsync(req: express.Request, res: express.Response, next: express.NextFunction)
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

    private async getActorAsync(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        const { name } = req.body.user;

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

    private async updateUserAsync(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        const { guid, name, role } = req.body.user;

        if (guid == null)
        {
            // return next(new ValidationException("User guid is null or undefined"));
            return res.status(400).json({ error: "User guid is null or undefined" });
        }

        if (name == null && role == null)
        {
            // return next(new ValidationException("All parameters are null or undefined"));
            return res.status(400).json({ error: "All parameters are null or undefined" });
        }

        try
        {
            const changeSet = {};
            if (name != null) { Object.assign(changeSet, { name }); }
            if (role != null) { Object.assign(changeSet, { role }); }

            const user = await this.userController.updateUserAsync(guid, changeSet);
            const actor = user.actor;
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

    private async updateUserPasswordAsync(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        const { guid, password } = req.body.user;

        if (password == null)
        {
            return res.status(400).json({ error: "New password is null or undefined" });
        }

        try
        {
            const user = await this.userController.updateUserPasswordAsync(guid, password);
            const actor = user.actor;
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

    private async createUserAsync(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        const { name, password } = req.body.user;

        if (name == null || name === "")
        {
            return res.status(400).json({ error: "User name is null, undefined or empty string" });
        }
        if (!this.passwordIsValid(password))
        {
            return res.status(400).json({ error: "Password is null, undefined, empty string or under 4 characters long" });
        }

        try
        {
            const user = await this.userController.createUserAsync({ name, password, isFixture: false });
            const actor = user.actor;
            res.json({ actor });
        }
        catch (e)
        {
            next(e);
        }
    }

    private passwordIsValid(password: string): boolean
    {
        return password != null
            && password !== ""
            && password.length > 4;
    }
}
