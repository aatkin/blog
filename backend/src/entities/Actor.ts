import { Entity, Column, PrimaryColumn, OneToOne, OneToMany, JoinColumn, Index } from "typeorm";

import { Role } from "./Role";
import { Page } from "./Page";
import { UserIdentity } from "./UserIdentity";

@Entity()
export class Actor {
  @PrimaryColumn({ length: 36 })
  public guid: string;

  @Column()
  @Index()
  public name: string;

  @OneToOne<UserIdentity>(t => UserIdentity, user => user.actor, {
    cascade: ["insert", "update"]
  })
  public user: UserIdentity;

  @OneToMany<Role>(t => Role, role => role.actors, { cascade: ["insert"] })
  @JoinColumn()
  public role: Role;

  @OneToMany<Page>(t => Page, page => page.owner, { cascade: ["insert"] })
  public pages: Page[];

  constructor(guid: string, name: string, role: Role, user?: UserIdentity, pages?: Page[]) {
    this.guid = guid;
    this.name = name;
    this.user = user!;
    this.role = role;
    this.pages = pages || [];
  }
}

interface ActorQueryParams {
  name?: string;
  guid?: string;
}

interface ActorUpdateParams {
  name?: string;
  role?: Role;
  pages?: Page[];
}

export { ActorQueryParams, ActorUpdateParams };
