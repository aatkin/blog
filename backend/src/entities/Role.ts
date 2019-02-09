import { Entity, Column, PrimaryColumn, ManyToOne, Index } from "typeorm";

import { Partial } from "../utils/Partial";
import { Actor } from "./Actor";


@Entity()
export class Role
{
    @PrimaryColumn({ length: 36 })
    public guid: string;

    @Column()
    @Index()
    public name: string;

    @Column()
    public value: string;

    @ManyToOne(t => Actor, actor => actor.role)
    public actors: Actor[];

    constructor(guid: string, name: string, value: string, actors: Actor[] = [])
    {
        this.guid = guid;
        this.name = name;
        this.value = value;
        this.actors = actors;
    }
}

type RoleQueryParams = {
    name?: string;
    guid?: string;
};

type RoleUpdateParams = {
    name: string;
    value: string;
};

export { RoleQueryParams, RoleUpdateParams };
