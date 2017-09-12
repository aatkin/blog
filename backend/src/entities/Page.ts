import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, VersionColumn, Index, ManyToOne } from "typeorm";

import { Partial } from "../utils/Partial";
import { ContentNode } from "../models/ContentNode";
import { PageMetadata } from "../models/PageMetadata";
import { User } from "../entities/User";


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

    @Column()
    public metadata: PageMetadata;

    @ManyToOne(t => User, user => user.pages)
    public owner: User;

    @CreateDateColumn()
    public createdDate: Date;

    @UpdateDateColumn()
    public updateDate: Date;

    @VersionColumn()
    public version: number;

    constructor(guid: string, owner: User)
    {
        this.guid = guid;
        this.owner = owner;
    }
}

type PageParams = Partial<Page>;

export { PageParams };
