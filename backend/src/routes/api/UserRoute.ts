import { injectable, inject } from "inversify";
import * as express from "express";
import { pick } from "ramda";

import { Types } from "src/Types";
import { IUserController } from "src/controllers/UserController";
import { AuthenticatedRequest } from "src/controllers/AuthenticationController";
import { ILoggerService } from "src/services/LoggerService";
import { ValidationException } from "src/exceptions/ValidationException";
import { UserNotFoundException } from "src/exceptions/UserNotFoundException";
import { UserIdentityQueryParams, UserIdentityUpdateParams } from "src/entities/UserIdentity";
import { DatabaseError } from "src/constants/Errors";

export interface IUserRoute {
  router: express.Router;
}

@injectable()
export class UserRoute implements IUserRoute {
  public router: express.Router;

  constructor(
    @inject(Types.UserController) private userController: IUserController,
    @inject(Types.Logger) private logger: ILoggerService
  ) {
    this.router = express.Router();
    this.attachRoutes();
  }

  private attachRoutes(): void {
    this.router.get("/actors", this.getAllActors.bind(this));
    this.router.get("/personal", this.getUser.bind(this));
    this.router.post("/actor", this.validateBody, this.getActor.bind(this));
    this.router.post("/update", this.validateBody, this.updateUser.bind(this));
    this.router.post("/create", this.validateBody, this.createUser.bind(this));
  }

  private validateBody(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req.body) {
      return next(new ValidationException("Request body is null or undefined"));
    }
    if (!req.body.user || typeof req.body.user !== "object") {
      return next(new ValidationException("Request body must include user object"));
    }

    next();
  }

  private async getAllActors(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const actors = await this.userController.getActorsAsync();
      res.json({ actors });
    } catch (e) {
      next(e);
    }
  }

  private async getUser(
    req: AuthenticatedRequest,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const authenticatedUser = req.authenticatedUser;
      const user = pick(["name", "actor"], authenticatedUser);
      res.json({ user });
    } catch (e) {
      next(e);
    }
  }

  private async getActor(req: express.Request, res: express.Response, next: express.NextFunction) {
    const { name } = req.body.user as UserIdentityQueryParams;

    if (!name) {
      return next(new ValidationException("Parameter 'name' is null or undefined"));
    }

    try {
      const actor = await this.userController.getActorAsync({ name });
      return res.json({ actor });
    } catch (e) {
      next(e);
    }
  }

  private async updateUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const { guid, name, role } = req.body.user as UserIdentityUpdateParams;

    if (guid == null) {
      return next(new ValidationException("User guid is null or undefined"));
    }

    if (name == null && role == null) {
      return next(new ValidationException("All update parameters are null or undefined"));
    }

    try {
      const changeSet: UserIdentityUpdateParams = {};
      if (name != null) {
        Object.assign(changeSet, { name });
      }
      if (role != null) {
        Object.assign(changeSet, { role });
      }

      const actor = await this.userController.updateUserAsync(guid, changeSet);
      res.json({ actor });
    } catch (e) {
      if (e instanceof UserNotFoundException) {
        return res.status(400).send({ error: DatabaseError.UserNotFoundError });
      }

      next(e);
    }
  }

  private async createUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.json({ msg: "route: POST /api/user/create" });
  }
}
