import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";

import { Partial } from "../utils";
import { Role } from "./Role";


@Entity()
export class User
{
    @PrimaryColumn({ length: 36 })
    public guid: string;

    @Column()
    public name: string;

    @Column()
    public password: string;

    @Column()
    public isFixture: boolean;

    @OneToOne(type => Role)
    @JoinColumn()
    public role: Role;
}

type UserParams = Partial<User>;

export { UserParams };
