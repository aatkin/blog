import { Entity, Column, PrimaryColumn } from "typeorm";


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
