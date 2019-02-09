import { injectable, inject } from "inversify";
import * as uuid from "uuid/v4";

import { Types } from "../Types";
import { DatabaseException } from "../exceptions/DatabaseException";
import { DatabaseError } from "../constants/Errors";
import { IDatabaseService } from "../services/DatabaseService";
import { ILoggerService } from "../services/LoggerService";
import { IUserController } from "./UserController";
import { Page, PageQueryParams, PageUpdateParams, PageCreateParams } from "../entities/Page";
import { UserIdentity } from "../entities/UserIdentity";
import { Actor } from "../entities/Actor";


export interface IPageController
{
    getPagesAsync(): Promise<Page[]>;
    getActorPagesAsync(actorGuid: string): Promise<Page[]>;
    getPageAsync(pageParams: PageQueryParams): Promise<Page>;
    createPageAsync(actor: Actor, pageParams: PageCreateParams): Promise<Page>;
    updatePageAsync(guid: string, pageParams: PageUpdateParams): Promise<Page>;
}

@injectable()
export class PageController implements IPageController
{
    constructor(@inject(Types.DatabaseService) private databaseService: IDatabaseService,
                @inject(Types.UserController) private userController: IUserController,
                @inject(Types.Logger) private logger: ILoggerService) {}

    public async getPagesAsync(): Promise<Page[]>
    {
        try
        {
            const pageRepository = await this.databaseService.connection.getRepository(Page);
            const pages = await pageRepository
                .createQueryBuilder("page")
                .leftJoinAndSelect("page.owner", "owner")
                .getMany();

            return pages;
        }
        catch (e)
        {
            this.logger.error(e);
            throw new DatabaseException(DatabaseError.PageNotFoundError);
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
            throw new DatabaseException(DatabaseError.PageNotFoundError);
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
            throw new DatabaseException(DatabaseError.PageNotFoundError);
        }
    }

    public async createPageAsync(actor: Actor, pageParams: PageCreateParams): Promise<Page>
    {
        const newPage = new Page(uuid(), pageParams.title, actor);

        try
        {
            const pageRepository = await this.databaseService.connection.getRepository(Page);
            await pageRepository.save(newPage);
            return newPage;
        }
        catch (e)
        {
            this.logger.error(e);
            throw new DatabaseException(DatabaseError.PagePersistError);
        }
    }

    public async updatePageAsync(guid: string, pageParams: PageUpdateParams): Promise<Page>
    {
        try
        {
            const pageRepository = await this.databaseService.connection.getRepository(Page);
            const page = await this.getPageAsync({ guid });

            if (page == null)
            {
                throw new DatabaseException(DatabaseError.PageNotFoundError);
            }

            // TODO: content nodes must be validated before persisting
            if (pageParams.content != null)
            {
                Object.assign(page, { content: pageParams.content });
            }
            if (pageParams.metadata != null) { Object.assign(page, { metadata: pageParams.metadata }); }
            if (pageParams.ownerGuid != null)
            {
                const owner = await this.userController.getActorAsync({ guid: pageParams.ownerGuid });
                Object.assign(page, { owner });
            }
            if (pageParams.title != null) { Object.assign(page, { title: pageParams.title }); }

            await pageRepository.save(page);
            return page;
        }
        catch (e)
        {
            this.logger.error(e);

            if (e instanceof DatabaseException)
            {
                throw e;
            }

            throw new DatabaseException(DatabaseError.PagePersistError);
        }
    }
}
