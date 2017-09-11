import { injectable, inject } from "inversify";

import { Types } from "../Types";
import { IDatabaseService } from "../DatabaseService";
import { Page, PageParams } from "../entities/Page";
import { ILogger } from "../utils/Logging";


export interface IPageController
{
    getPagesAsync(): Promise<Page[]>;
}

@injectable()
export class PageController implements IPageController
{
    constructor(@inject(Types.DatabaseService) private databaseService: IDatabaseService,
                @inject(Types.Logger) private logger: ILogger) {}

    public async getPagesAsync(): Promise<Page[]>
    {

    }
}
