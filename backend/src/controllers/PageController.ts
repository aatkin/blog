import { injectable, inject } from "inversify";
import * as uuid from "uuid/v4";

import { Types } from "src/Types";
import { DatabaseException } from "src/exceptions/DatabaseException";
import { PageNotFoundException } from "src/exceptions/PageNotFoundException";
import { NotAuthorizedException } from "src/exceptions/NotAuthorizedException";
import { InternalServerException } from "src/exceptions/InternalServerException";
import { ActorNotFoundException } from "src/exceptions/ActorNotFoundException";
import { DatabaseError } from "src/constants/Errors";
import { IDatabaseService } from "src/services/DatabaseService";
import { IUserController } from "./UserController";
import { Page, PageQueryParams, PageUpdateParams, PageCreateParams } from "src/entities/Page";
import { Actor } from "src/entities/Actor";

export interface IPageController {
  getPagesAsync(): Promise<Page[]>;
  getActorPagesAsync(actorGuid: string): Promise<Page[]>;
  getPageAsync(pageParams: PageQueryParams): Promise<Page>;
  createPageAsync(actor: Actor, pageParams: PageCreateParams): Promise<Page>;
  updatePageAsync(guid: string, pageParams: PageUpdateParams, actor: Actor): Promise<Page>;
}

@injectable()
export class PageController implements IPageController {
  constructor(
    @inject(Types.DatabaseService)
    private databaseService: IDatabaseService,
    @inject(Types.UserController) private userController: IUserController
  ) {}

  public async getPagesAsync(): Promise<Page[]> {
    try {
      const pageRepository = await this.databaseService.connection.getRepository(Page);
      const pages = await pageRepository
        .createQueryBuilder("page")
        .leftJoinAndSelect("page.owner", "owner")
        .leftJoinAndSelect("page.scopes", "scopes")
        .getMany();

      return pages;
    } catch (e) {
      throw InternalServerException.fromError(e);
    }
  }

  public async getActorPagesAsync(actorGuid: string): Promise<Page[]> {
    try {
      const pageRepository = await this.databaseService.connection.getRepository(Page);
      const pages = await pageRepository
        .createQueryBuilder("page")
        .where("page.owner = :keyword", { keyword: actorGuid })
        .leftJoinAndSelect("page.scopes", "scope")
        .leftJoinAndSelect("scope.roles", "role")
        .getMany();
      return pages;
    } catch (e) {
      throw InternalServerException.fromError(e);
    }
  }

  public async getPageAsync(pageParams: PageQueryParams): Promise<Page> {
    try {
      const pageRepository = await this.databaseService.connection.getRepository(Page);
      let page;

      if (pageParams.guid != null) {
        page = await pageRepository
          .createQueryBuilder("page")
          .where("page.guid = :keyword", { keyword: pageParams.guid })
          .innerJoinAndSelect("page.owner", "owner")
          .getOne();
      } else {
        page = await pageRepository
          .createQueryBuilder("page")
          .where("page.title LIKE :keyword", {
            keyword: `%${pageParams.title}%`
          })
          .innerJoinAndSelect("page.owner", "owner")
          .getOne();
      }

      if (!page) {
        throw new PageNotFoundException();
      }

      return page;
    } catch (e) {
      if (e instanceof PageNotFoundException) {
        throw e;
      } else {
        throw InternalServerException.fromError(e);
      }
    }
  }

  public async createPageAsync(actor: Actor, pageParams: PageCreateParams): Promise<Page> {
    const newPage = new Page(uuid(), pageParams.title || "", actor);

    try {
      const pageRepository = await this.databaseService.connection.getRepository(Page);
      return await pageRepository.save(newPage);
    } catch (e) {
      throw InternalServerException.fromError(e);
    }
  }

  public async updatePageAsync(
    guid: string,
    pageParams: PageUpdateParams,
    actor: Actor
  ): Promise<Page> {
    try {
      const pageRepository = await this.databaseService.connection.getRepository(Page);
      const page = await this.getPageAsync({ guid });

      if (!page) {
        throw new DatabaseException(DatabaseError.PageNotFoundError);
      }

      if (actor.guid !== page.owner.guid) {
        throw new NotAuthorizedException("Not authorized");
      }

      // TODO: content nodes must be validated before persisting
      if (pageParams.content != null) {
        Object.assign(page, { content: pageParams.content });
      }
      if (pageParams.metadata != null) {
        Object.assign(page, { metadata: pageParams.metadata });
      }
      if (pageParams.ownerGuid != null) {
        const owner = await this.userController.getActorAsync({
          guid: pageParams.ownerGuid
        });
        Object.assign(page, { owner });
      }
      if (pageParams.title != null) {
        Object.assign(page, { title: pageParams.title });
      }

      await pageRepository.save(page);
      return page;
    } catch (e) {
      if (
        e instanceof DatabaseException ||
        e instanceof NotAuthorizedException ||
        e instanceof InternalServerException ||
        e instanceof ActorNotFoundException
      ) {
        throw e;
      } else {
        throw InternalServerException.fromError(e);
      }
    }
  }
}
