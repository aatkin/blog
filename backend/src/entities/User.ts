import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from "typeorm";

import { Partial } from "../utils/Partial";
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

    @OneToOne(t => Role)
    @JoinColumn()
    public role: Role;

    constructor(guid: string, name: string, password: string, isFixture: boolean, role: Role)
    {
        this.guid = guid;
        this.name = name;
        this.password = password;
        this.isFixture = isFixture;
        this.role = role;
    }

    public static fromParams(userParams: UserParams): User
    {
        const { guid, name, password, isFixture, role } = userParams;
        return new User(guid, name, password, isFixture, role);
    }
}

type UserParams = Partial<User>;

export { UserParams };
