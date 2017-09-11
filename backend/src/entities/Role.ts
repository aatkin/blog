import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";

import { Partial } from "../utils/Partial";
import { User } from "./User";


@Entity()
export class Role
{
    @PrimaryColumn({ length: 36 })
    public guid: string;

    @Column()
    public name: string;

    @Column()
    public value: string;

    constructor(guid: string, name: string, value: string)
    {
        this.guid = guid;
        this.name = name;
        this.value = value;
    }
}

type RoleParams = Partial<Role>;

export { RoleParams };
