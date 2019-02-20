import { Entity, Column, PrimaryColumn, ManyToMany, ManyToOne, JoinTable } from "typeorm";

import { Role } from "src/entities/Role";
import { Page } from "src/entities/Page";

export type Action = "create" | "update" | "delete" | "view" | "all";

@Entity()
export class Scope {
  @PrimaryColumn({ length: 36 })
  public guid: string;

  @Column()
  public action: Action;

  @ManyToMany<Role>(_type => Role, { eager: true })
  @JoinTable()
  public roles: Role[] | undefined;

  @ManyToOne<Page>(_type => Page, page => page.scopes)
  public page: Page | undefined;

  constructor(guid: string, action: Action, roles?: Role[], page?: Page) {
    this.guid = guid;
    this.action = action;
    this.roles = roles;
    this.page = page;
  }
}
