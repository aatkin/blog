import {
  Entity,
  Column,
  PrimaryColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  Index
} from "typeorm";

import { Role } from "src/entities/Role";
import { Page } from "src/entities/Page";
import { UserIdentity } from "src/entities/UserIdentity";

@Entity()
export class Actor {
  @PrimaryColumn({ length: 36 })
  public guid: string;

  @Column()
  @Index()
  public name: string;

  @OneToOne<UserIdentity>(_type => UserIdentity, user => user.actor, {
    cascade: ["insert", "update"]
  })
  public user: UserIdentity | undefined;

  @ManyToMany<Role>(_type => Role, role => role.actors, { cascade: ["insert"] })
  @JoinTable({
    joinColumn: { name: "role", referencedColumnName: "guid" },
    inverseJoinColumn: { name: "actor", referencedColumnName: "guid" }
  })
  public roles: Role[] | undefined;

  @OneToMany<Page>(_type => Page, page => page.owner, { cascade: ["insert"] })
  public pages: Page[] | undefined;

  constructor(guid: string, name: string, roles?: Role[], user?: UserIdentity, pages?: Page[]) {
    this.guid = guid;
    this.name = name;
    this.user = user;
    this.roles = roles;
    this.pages = pages;
  }
}

interface ActorQueryParams {
  name?: string;
  guid?: string;
}

interface ActorUpdateParams {
  name?: string;
  roles?: Role[];
  pages?: Page[];
}

export { ActorQueryParams, ActorUpdateParams };
