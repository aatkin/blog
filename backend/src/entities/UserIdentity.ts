import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, Index } from "typeorm";

import { Role } from "src/entities/Role";
import { Actor } from "src/entities/Actor";

@Entity()
export class UserIdentity {
  @PrimaryColumn({ type: "uuid" })
  public guid: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  @Index()
  public name: string;

  @Column()
  public passwordHash: string;

  @OneToOne<Actor>(_type => Actor, actor => actor.user, { cascade: true })
  @JoinColumn()
  public actor: Actor | undefined;

  @Column()
  public isFixture: boolean;

  constructor(
    guid: string,
    email: string,
    name: string,
    passwordHash: string,
    isFixture: boolean,
    actor?: Actor
  ) {
    this.guid = guid;
    this.email = email;
    this.name = name;
    this.passwordHash = passwordHash;
    this.isFixture = isFixture;
    this.actor = actor;
  }
}

interface UserIdentityQueryParams {
  guid?: string;
  email?: string;
  role?: Role;
}

interface UserIdentityUpdateParams {
  guid?: string;
  email?: string;
  name?: string;
  actor?: Actor;
  role?: Role;
  password?: string;
}

interface UserIdentityCreateParams {
  name: string;
  email: string;
  password: string;
  isFixture: boolean;
  actor?: Actor;
}

export { UserIdentityQueryParams, UserIdentityUpdateParams, UserIdentityCreateParams };
