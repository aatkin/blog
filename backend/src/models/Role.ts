import { Entity, Column, PrimaryColumn } from "typeorm";

import { Partial } from "../utils";


@Entity()
export class Role
{
    @PrimaryColumn({ length: 36 })
    public guid: string;

    @Column()
    public name: string;

    @Column()
    public value: string;
}

type RoleParams = Partial<Role>;

export { RoleParams };
