import { injectable, inject } from "inversify";
import * as express from "express";

import { Types } from "../../Types";
import { IPageController } from "../../controllers/PageController";
import { ILoggerService } from "../../services/LoggerService";
import { ValidationException } from "../../exceptions/ValidationException";
import { DatabaseException } from "../../exceptions/DatabaseException";
import { PageParams } from "../../entities/Page";


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
                { method: "POST", route: "/", params: "page" }
            ]
        };
    }

    private attachRoutes(): void
    {
        this.router.get("/", this.getAllPages.bind(this));
        this.router.post("/", this.validateBody, this.getPage.bind(this));
        // this.router.post("/update", this.validateBody, this.updateUser.bind(this));
        // this.router.get("/create", this.validateBody, this.createPage.bind(this));
    }

    private validateBody(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        if (!req.body)
        {
            // return next(new ValidationException("Request body is null or undefined"));
            return res.status(400).json({ error: "Request body is null or undefined" });
        }
        if (!req.body.page || typeof req.body.page !== "object")
        {
            // return next(new ValidationException("Request body must include page object"));
            return res.status(400).json({ error: "Request body must include page object" });
        }

        next();
    }

    private async getAllPages(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        try
        {
            const pages = await this.pageController.getPagesAsync();
            res.json({ pages });
        }
        catch (e)
        {
            next(e);
        }
    }

    private async getPage(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        const { title, guid } = <PageParams>(req.body.page);

        if (title == null && guid == null)
        {
            // return next(new ValidationException("Parameter 'name' is null or undefined"));
            return res.status(400).json({ error: "Parameters 'name' and 'guid' are null or undefined" });
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

    // private async createPage(req: express.Request, res: express.Response, next: express.NextFunction)
    // {
    //     try
    //     {
    //         const page = await this.pageController.createPageAsync({ title, guid });
    //         return res.json({ page });
    //     }
    // }
}
