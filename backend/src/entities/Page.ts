import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, VersionColumn, Index, ManyToOne } from "typeorm";

import { Partial } from "../utils/Partial";
import { ContentNode } from "../models/ContentNode";
import { PageMetadata } from "../models/PageMetadata";
import { Actor } from "../entities/Actor";


@Entity()
export class Page
{
    @PrimaryColumn({ length: 36 })
    public guid: string;

    @Column({ type: "jsonb" })
    public content: ContentNode[];

    @Column()
    @Index()
    public title: string;

    @Column({ type: "jsonb" })
    public metadata: PageMetadata;

    @ManyToOne(t => Actor, actor => actor.pages)
    public owner: Actor;

    @CreateDateColumn()
    public createdDate: Date;

    @UpdateDateColumn()
    public updateDate: Date;

    @VersionColumn()
    public version: number;

    constructor(guid: string, owner: Actor, title: string)
    {
        this.guid = guid;
        this.owner = owner;
        this.content = [];
        this.metadata = new PageMetadata();

        if (title === "")
        {
            this.title = owner.guid.slice(0, 4) + "-" + guid.slice(0, 4) + "-post";
        }
    }
}

type PageQueryParams = {
    guid?: string;
    title?: string;
    createdDate?: string;
    updateDate?: string;
};

type PageUpdateParams = {
    title?: string;
    content?: ContentNode[];
    metadata?: PageMetadata;
    ownerGuid?: string;
};

type PageCreateParams = {
    title?: string;
}

export { PageQueryParams, PageUpdateParams, PageCreateParams };
