import { MigrationInterface, QueryRunner } from "typeorm";
import * as uuid from "uuid/v4";
import * as bcrypt from "bcrypt";

import { Role } from "src/entities/Role";
import { Actor } from "src/entities/Actor";
import { UserIdentity } from "src/entities/UserIdentity";
import { Page } from "src/entities/Page";
import { Scope } from "src/entities/Scope";

const adminRole = new Role(uuid(), "Admin", "ADMIN");

const defaultRole = new Role("6596a88f-3796-496f-863e-4599aee0945a", "User", "USER");

const adminUser = new UserIdentity(
  "ad279408-7f62-4f1a-920b-5cf8fc364a66",
  "anssi.kinnunen01@gmail.com",
  "Administrator",
  bcrypt.hashSync("admin123", bcrypt.genSaltSync()),
  true
);

const regularUser = new UserIdentity(
  "1381c6d9-9cb2-4a53-9509-40dcd4d24e6a",
  "briikie@gmail.com",
  "Regular Joe",
  bcrypt.hashSync("sql123", bcrypt.genSaltSync()),
  true
);

const adminActor = new Actor(
  "895d2543-1318-426c-b751-687f01f830b5",
  "Administrator",
  [adminRole],
  adminUser
);

const regularActor = new Actor(
  "f60536b6-f6d2-49c0-90d2-121ab9751e31",
  "Default",
  [defaultRole],
  regularUser
);

const defaultPage = new Page(
  "157d0947-a5d6-4c14-bd94-32d642765dd5",
  "Front page express 2000. Testailen tässä JWT-tokenin toimintaa.",
  adminActor,
  [new Scope(uuid(), "all", [adminRole]), new Scope(uuid(), "view", [defaultRole])]
);

const secondPage = new Page(
  "997d0123-a5d6-4c14-bd01-00d642765dd5",
  "Kakkossivu.",
  regularActor,
  [new Scope(uuid(), "all", [adminRole]), new Scope(uuid(), "all", [defaultRole])]
);

export class Fixtures1504987869455 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const actorRepository = queryRunner.manager.getRepository(Actor);
    const roleRepository = queryRunner.manager.getRepository(Role);
    const pageRepository = queryRunner.manager.getRepository(Page);
    await actorRepository.save(adminActor);
    await actorRepository.save(regularActor);
    await roleRepository.save(defaultRole);
    await pageRepository.save(defaultPage);
    await pageRepository.save(secondPage);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const actorRepository = queryRunner.manager.getRepository(Actor);
    const roleRepository = queryRunner.manager.getRepository(Role);
    const pageRepository = queryRunner.manager.getRepository(Page);
    await pageRepository.delete(secondPage);
    await pageRepository.delete(defaultPage);
    await roleRepository.delete(defaultRole);
    await actorRepository.delete(adminActor);
    await actorRepository.delete(regularActor);
  }
}
