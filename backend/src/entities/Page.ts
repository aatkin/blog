import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  Index,
  ManyToOne
} from "typeorm";

import { ContentNode } from "src/models/ContentNode";
import { PageMetadata } from "src/models/PageMetadata";
import { Actor } from "src/entities/Actor";

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

  @CreateDateColumn()
  public createdDate: Date;

  @UpdateDateColumn()
  public updateDate: Date | undefined;

  @VersionColumn()
  public version: number;

  constructor(
    guid: string,
    title: string,
    owner: Actor,
    createdDate: Date,
    version: number,
    updateDate?: Date
  ) {
    this.guid = guid;
    this.owner = owner;
    this.content = [];
    this.metadata = new PageMetadata();
    this.createdDate = createdDate;
    this.updateDate = updateDate;
    this.version = version;

    if (title === "") {
      this.title = owner.guid.slice(0, 4) + "-" + guid.slice(0, 4) + "-post";
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
