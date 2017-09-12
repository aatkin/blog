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
        this.title = title;
        this.content = [];
        this.metadata = { description: null };
    }
}

type PageQueryParams = {
    guid?: string;
    title?: string;
    createdDate?: Date;
    updateDate?: Date;
};

type PageUpdateParams = {
    title?: string;
    content?: ContentNode[];
    metadata?: PageMetadata;
    owner?: Actor;
};

export { PageQueryParams, PageUpdateParams };
