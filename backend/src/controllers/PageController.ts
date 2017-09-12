import { injectable, inject } from "inversify";
import * as uuid from "uuid/v4";

import { Types } from "../Types";
import { IDatabaseService } from "../services/DatabaseService";
import { ILoggerService } from "../services/LoggerService";
import { Page, PageQueryParams, PageUpdateParams } from "../entities/Page";
import { UserIdentity } from "../entities/UserIdentity";
import { Actor } from "../entities/Actor";


export interface IPageController
{
    getPagesAsync(): Promise<Page[]>;
    getActorPagesAsync(actorGuid: string): Promise<Page[]>;
    getPageAsync(pageParams: PageQueryParams): Promise<Page>;
    createPageAsync(actor: Actor): Promise<Page>;
    // updatePageAsync(pageParams: PageParams): Promise<Page>;
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
                .innerJoinAndSelect("page.owner", "owner")
                .getMany();

            return pages;
        }
        catch (e)
        {
            this.logger.error(e);
            throw e;
        }
    }

    public async getActorPagesAsync(actorGuid: string): Promise<Page[]>
    {
        try
        {
            const pageRepository = await this.databaseService.connection.getRepository(Page);
            const pages = await pageRepository
                .createQueryBuilder("page")
                .where("page.owner = :keyword", { keyword: actorGuid })
                .getMany();
            return pages;
        }
        catch (e)
        {
            this.logger.error(e);
            throw e;
        }
    }

    public async getPageAsync(pageParams: PageQueryParams): Promise<Page>
    {
        try
        {
            const pageRepository = await this.databaseService.connection.getRepository(Page);
            let page;

            if (pageParams.guid != null)
            {
                page = await pageRepository
                    .createQueryBuilder("page")
                    .where("page.guid = :keyword", { keyword: pageParams.guid })
                    .innerJoinAndSelect("page.owner", "owner")
                    .getOne();
            }
            else
            {
                page = await pageRepository
                    .createQueryBuilder("page")
                    .where("page.title LIKE :keyword", { keyword: `%${pageParams.title}%` })
                    .innerJoinAndSelect("page.owner", "owner")
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

    public async createPageAsync(actor: Actor, title: string = ""): Promise<Page>
    {
        try
        {
            const pageRepository = await this.databaseService.connection.getRepository(Page);
            const newPage = new Page(uuid(), actor, title);
            await pageRepository.persist(newPage);
            return newPage;
        }
        catch (e)
        {
            this.logger.error(e);
            throw e;
        }
    }

    public async updatePageAsync(pageParams: PageUpdateParams): Promise<Page>
    {
        throw new Error("not implemented yet");
    }
}
