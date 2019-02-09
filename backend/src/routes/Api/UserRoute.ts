import { injectable, inject } from "inversify";
import * as express from "express";

import { Types } from "../../Types";
import { IUserController } from "../../controllers/UserController";
import { AuthenticatedRequest } from "../../controllers/AuthenticationController";
import { ILoggerService } from "../../services/LoggerService";
import { ValidationException } from "../../exceptions/ValidationException";
import { DatabaseException } from "../../exceptions/DatabaseException";
import { UserNotFoundException } from "../../exceptions/UserNotFoundException";
import { UserIdentityQueryParams, UserIdentityUpdateParams } from "../../entities/UserIdentity";
import { DatabaseError, ValidationError } from "../../constants/Errors";


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
        this.router.get("/debug", this.getUserInfoAsync.bind(this));
    }

    private validateBody(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction)
    {
        if (!req.body)
        {
            return res.status(400).json({
                error: ValidationError.Generic,
                message: "Request body is null or undefined"
            });
        }
        if (!req.body.user || typeof req.body.user !== "object")
        {
            return res.status(400).json({
                error: ValidationError.Generic,
                message: "Request body must include user object"
            });
        }

        next();
    }

    private async getAllActorsAsync(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction)
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

    private async getActorAsync(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction)
    {
        const { name } = req.body.user;

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

    private async updateUserAsync(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction)
    {
        const { guid, name, role } = req.body.user;

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
                return res.status(400).send({ error: DatabaseError.UserNotFoundError, message: e.message });
            }

            next(e);
        }
    }

    private async updateUserPasswordAsync(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction)
    {
        const { guid, password } = req.body.user;

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
                return res.status(400).send({ error: DatabaseError.UserNotFoundError, message: e.message });
            }
            if (e instanceof ValidationException)
            {
                return res.status(400).send({ error: ValidationError.Generic, message: e.message });
            }

            next(e);
        }
    }

    private async createUserAsync(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction)
    {
        const { name, password } = req.body.user;

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

    private async getUserInfoAsync(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction)
    {
        try
        {
            res.json({ actor: req.authenticatedActor, user: req.authenticatedUser });
        }
        catch (e)
        {
            next(e);
        }
    }
}
