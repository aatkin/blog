import { injectable, inject } from "inversify";
import * as express from "express";

import { Types } from "../../Types";
import { IUserController } from "../../controllers/UserController";
import { ILogger } from "../../utils/Logging";
import { ValidationException } from "../../exceptions/ValidationException";
import { DatabaseException } from "../../exceptions/DatabaseException";
import { UserNotFoundException } from "../../exceptions/UserNotFoundException";
import { Errors } from "../../constants/Errors";


export interface IPageRoute
{
    router: express.Router;
}

@injectable()
export class PageRoute implements IPageRoute
{
    public router: express.Router;

    constructor(@inject(Types.UserController) private userController: IUserController,
                @inject(Types.Logger) private logger: ILogger)
    {
        this.router = express.Router();
        this.attachRoutes();
    }

    private attachRoutes(): void
    {
        this.router.get("/", this.getAllActors.bind(this));
        this.router.post("/", this.validateBody, this.getActor.bind(this));
        this.router.post("/update", this.validateBody, this.updateUser.bind(this));
        // this.router.get("/create", this.createUser.bind(this));
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
