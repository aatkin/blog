import { injectable, inject } from "inversify";

import { Types } from "../Types";
import { IDatabaseService } from "../services/DatabaseService";
import { ILoggerService } from "../services/LoggerService";
import { Page, PageParams } from "../entities/Page";


export interface IPageController
{
    getPagesAsync(): Promise<Page[]>;
    getPageAsync(pageParams: PageParams): Promise<Page>;
}

@injectable()
export class PageController implements IPageController
{
    constructor(@inject(Types.DatabaseService) private databaseService: IDatabaseService,
                @inject(Types.Logger) private logger: ILoggerService) {}

    public async getPagesAsync(): Promise<Page[]>
    {
        try
        {
            const pageRepository = await this.databaseService.connection.getRepository(Page);
            const pages = await pageRepository
                .createQueryBuilder("page")
                .innerJoinAndSelect("page.content", "content")
                .getMany();
            return pages;
        }
        catch (e)
        {
            this.logger.error(e);
            throw e;
        }
    }

    public async getPageAsync(pageParams: PageParams): Promise<Page>
    {
        try
        {
            const pageRepository = await this.databaseService.connection.getRepository(Page);
            let page;

            if (pageParams.guid != null)
            {
                page = await pageRepository
                    .createQueryBuilder("page")
                    .where("page.guid IS :keyword", { keyword: pageParams.guid })
                    .innerJoinAndSelect("page.content", "content")
                    .getOne();
            }
            else
            {
                page = await pageRepository
                    .createQueryBuilder("page")
                    .where("page.title LIKE :keyword", { keyword: `%${pageParams.title}%` })
                    .innerJoinAndSelect("page.content", "content")
                    .getOne();
            }


            if (page != null)
            {
                return page;
            }

            return null;
        }
        catch (e)
        {
            this.logger.error(e);
            throw e;
        }
    }
}
