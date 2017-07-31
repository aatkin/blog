import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";

import { Role } from "./Role";


@Entity()
export class User
{
    @PrimaryColumn({ length: 36 })
    public guid: string;

    @Column()
    public name: string;

    @OneToOne(type => Role)
    @JoinColumn()
    public role: Role;
}
