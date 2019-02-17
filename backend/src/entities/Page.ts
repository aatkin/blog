import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  Index,
  ManyToOne,
  OneToMany
} from "typeorm";

import { ContentNode } from "src/models/ContentNode";
import { PageMetadata } from "src/models/PageMetadata";
import { Actor } from "src/entities/Actor";
import { Scope } from "src/entities/Scope";

@Entity()
export class Page {
  @PrimaryColumn({ length: 36 })
  public guid: string;

  @Column({ type: "jsonb" })
  public content: ContentNode[];

  @Column()
  @Index()
  public title: string;

  @Column({ type: "jsonb" })
  public metadata: PageMetadata;

  @ManyToOne(_type => Actor, actor => actor.pages)
  public owner: Actor;

  @OneToMany(_type => Scope, scope => scope.page, { eager: true, cascade: true })
  public scopes: Scope[] | undefined;

  @CreateDateColumn()
  public createdDate: Date | undefined;

  @UpdateDateColumn()
  public updateDate: Date | undefined;

  @VersionColumn()
  public version: number | undefined;

  constructor(
    guid: string,
    title: string,
    owner: Actor,
    scopes?: Scope[]
  ) {
    this.guid = guid;
    this.owner = owner;
    this.content = [];
    this.metadata = new PageMetadata();
    this.scopes = scopes;

    if (title === "") {
      this.title = guid + "-post";
    } else {
      this.title = title;
    }
  }
}

interface PageQueryParams {
  guid?: string;
  title?: string;
  createdDate?: string;
  updateDate?: string;
}

interface PageUpdateParams {
  title?: string;
  content?: ContentNode[];
  metadata?: PageMetadata;
  ownerGuid?: string;
}

interface PageCreateParams {
  title?: string;
}

export { PageQueryParams, PageUpdateParams, PageCreateParams };
