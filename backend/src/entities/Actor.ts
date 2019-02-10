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

  @OneToOne<UserIdentity>(t => UserIdentity, user => user.actor, {
    cascade: ["insert", "update"]
  })
  public user: UserIdentity;

  @ManyToMany<Role>(t => Role, { cascade: ["insert"] })
  @JoinTable()
  public roles: Role[];

  @OneToMany<Page>(t => Page, page => page.owner, { cascade: ["insert"] })
  public pages: Page[];

  constructor(guid: string, name: string, roles: Role[], user?: UserIdentity) {
    this.guid = guid;
    this.name = name;
    this.user = user!;
    this.roles = roles;
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
