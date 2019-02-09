import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, Index } from "typeorm";

import { Role } from "src/entities/Role";
import { Actor } from "src/entities/Actor";

@Entity()
export class UserIdentity {
  @PrimaryColumn({ length: 36 })
  public guid: string;

  @Column()
  @Index()
  public name: string;

  @Column()
  public passwordHash: string;

  @OneToOne<Actor>(t => Actor, actor => actor.user, { cascade: true })
  @JoinColumn()
  public actor: Actor | undefined;

  @Column()
  public isFixture: boolean;

  constructor(guid: string, name: string, passwordHash: string, isFixture: boolean, actor?: Actor) {
    this.guid = guid;
    this.name = name;
    this.passwordHash = passwordHash;
    this.isFixture = isFixture;
    this.actor = actor;
  }
}

interface UserIdentityQueryParams {
  guid?: string;
  name?: string;
  role?: Role;
}

interface UserIdentityUpdateParams {
  guid?: string;
  name?: string;
  actor?: Actor;
  role?: Role;
  password?: string;
}

interface UserIdentityCreateParams {
  name: string;
  password: string;
  isFixture: boolean;
  actor?: Actor;
}

export { UserIdentityQueryParams, UserIdentityUpdateParams, UserIdentityCreateParams };
