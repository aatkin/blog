import { injectable, inject } from "inversify";
import * as express from "express";

import { Types } from "../../Types";
import { IPageController } from "../../controllers/PageController";
import { AuthenticatedRequest } from "../../controllers/AuthenticationController";
import { ILoggerService } from "../../services/LoggerService";
import { ValidationException } from "../../exceptions/ValidationException";
import { DatabaseException } from "../../exceptions/DatabaseException";
import { Error } from "../../constants/Errors";
import { PageQueryParams, PageCreateParams, PageUpdateParams } from "../../entities/Page";


export interface IPageRoute
{
    router: express.Router;
    getRouteInformation(): any;
}

@injectable()
export class PageRoute implements IPageRoute
{
    public router: express.Router;

    constructor(@inject(Types.PageController) private pageController: IPageController,
                @inject(Types.Logger) private logger: ILoggerService)
    {
        this.router = express.Router();
        this.attachRoutes();
    }

    public getRouteInformation(): any
    {
        return {
            route: "page",
            routes: [
                { method: "GET", route: "/" },
                { method: "GET", route: "/:userGuid" },
                { method: "POST", route: "/", params: "page" }
            ]
        };
    }

    private attachRoutes(): void
    {
        this.router.get("/", this.getAllPagesAsync.bind(this));
        this.router.post("/", this.validateBody, this.getPageAsync.bind(this));
        this.router.get("/:userGuid", this.getAllUserPagesAsync.bind(this));
        this.router.post("/update", this.validateBody, this.updatePageAsync.bind(this));
        this.router.get("/create", this.validateBody, this.createPage.bind(this));
    }

    private validateBody(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction)
    {
        if (!req.body)
        {
            return res.status(400).json({ error: "Request body is null or undefined" });
        }
        if (!req.body.page || typeof req.body.page !== "object")
        {
            return res.status(400).json({ error: "Request body must include page object" });
        }

        next();
    }

    private async getAllPagesAsync(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction)
    {
        try
        {
            // TODO: require correct role
            const pages = await this.pageController.getPagesAsync();
            res.json({ pages });
        }
        catch (e)
        {
            next(e);
        }
    }

    private async getAllUserPagesAsync(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction)
    {
        try
        {
            // TODO: require correct role
            const { actorGuid } = req.params;
            const pages = await this.pageController.getActorPagesAsync(actorGuid);
            res.json({ pages });
        }
        catch (e)
        {
            next(e);
        }
    }

    private async getPageAsync(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction)
    {
        // TODO: require correct role

        const { title, guid } = <PageQueryParams>(req.body.page);

        if (title == null && guid == null)
        {
            return res.status(400).json({ error: Error.ValidationError, message: "Parameters 'name' and 'guid' are null or undefined" });
        }

        try
        {
            const page = await this.pageController.getPageAsync({ title, guid });
            return res.json({ page });
        }
        catch (e)
        {
            next(e);
        }
    }

    private async updatePageAsync(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction)
    {
        const { pageGuid, content, metadata, ownerGuid, title } = <any>(req.body.page);

        try
        {
            const page = await this.pageController.updatePageAsync(pageGuid, { content, metadata, title, ownerGuid });
            return res.json({ page });
        }
        catch (e)
        {
            next(e);
        }
    }

    private async createPage(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction)
    {
        // TODO: validate actor role

        const { title } = <PageCreateParams>(req.body.page);

        try
        {
            const page = await this.pageController.createPageAsync({ title });
            return res.json({ page });
        }
        catch (e)
        {
            next(e);
        }
    }
}
