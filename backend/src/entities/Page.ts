import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, VersionColumn } from "typeorm";

import { Partial } from "../utils/Partial";
import { PageContent } from "../models/PageContent";


@Entity()
export class Page
{
    @PrimaryColumn({ length: 36 })
    public guid: string;

    @Column({ type: "jsonb" })
    public content: PageContent;

    @Column()
    public title: string;

    @CreateDateColumn()
    public createdDate: Date;

    @UpdateDateColumn()
    public updateDate: Date;

    @VersionColumn()
    public version: number;
}

type PageParams = Partial<Page>;

export { PageParams };
