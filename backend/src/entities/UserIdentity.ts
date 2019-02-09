import { Entity, Column, PrimaryColumn, OneToOne, OneToMany, JoinColumn, Index } from "typeorm";

import { Partial } from "../utils/Partial";
import { Role } from "./Role";
import { Page } from "./Page";
import { Actor } from "./Actor";


@Entity()
export class UserIdentity
{
    @PrimaryColumn({ length: 36 })
    public guid: string;

    @Column()
    @Index()
    public name: string;

    @Column()
    public passwordHash: string;

    @OneToOne(t => Actor, actor => actor.user, { cascadeAll: true })
    @JoinColumn()
    public actor: Actor;

    @Column()
    public isFixture: boolean;

    constructor(guid: string, name: string, passwordHash: string, isFixture: boolean, actor: Actor = null)
    {
        this.guid = guid;
        this.name = name;
        this.passwordHash = passwordHash;
        this.isFixture = isFixture;
        this.actor = actor;
    }
}

type UserIdentityQueryParams = {
    guid?: string;
    name?: string;
    role?: Role;
};

type UserIdentityUpdateParams = {
    name?: string;
    actor?: Actor;
};

type UserIdentityCreateParams = {
    name: string;
    password: string;
    isFixture: boolean;
    actor?: Actor;
};

export { UserIdentityQueryParams, UserIdentityUpdateParams, UserIdentityCreateParams };
