import { Entity, Column, PrimaryColumn, OneToOne, OneToMany, JoinColumn, Index } from "typeorm";

import { Role } from "./Role";
import { Page } from "./Page";
import { UserIdentity } from "./UserIdentity";


@Entity()
export class Actor
{
    @PrimaryColumn({ length: 36 })
    public guid: string;

    @Column()
    @Index()
    public name: string;

    @OneToOne(t => UserIdentity, user => user.actor, { cascadeInsert: true, cascadeUpdate: true })
    public user: UserIdentity;

    @OneToMany(t => Role, role => role.actors, { cascadeInsert: true })
    @JoinColumn()
    public role: Role;

    @OneToMany(t => Page, page => page.owner, { cascadeInsert: true })
    public pages: Page[];

    constructor(guid: string, name: string, role: Role, user?: UserIdentity, pages?: Page[])
    {
        this.guid = guid;
        this.name = name;
        this.user = user;
        this.role = role;
        this.pages = pages;
    }
}

type ActorQueryParams = {
    name?: string;
    guid?: string;
};

type ActorUpdateParams = {
    name?: string;
    role?: Role;
    pages?: Page[];
};

export { ActorQueryParams, ActorUpdateParams };
