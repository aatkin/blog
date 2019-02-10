import { MigrationInterface, QueryRunner } from "typeorm";
import * as uuid from "uuid/v4";
import * as bcrypt from "bcrypt";

import { Role } from "src/entities/Role";
import { Actor } from "src/entities/Actor";
import { UserIdentity } from "src/entities/UserIdentity";
import { Page } from "src/entities/Page";

const adminRole = new Role(uuid(), "Admin", "ADMIN");

const defaultRole = new Role("000000-e559-4273-a831-a23009effb7c", "User", "USER");

const adminUser = new UserIdentity(
  "000000-e123-4273-a456-a23009effb7c",
  "Administrator",
  bcrypt.hashSync("admin123", bcrypt.genSaltSync()),
  true
);

const adminActor = new Actor(uuid(), "Administrator", [adminRole], adminUser);

const defaultPage = new Page(uuid(), "Front page express 2000. Testailen tässä JWT-tokenin toimintaa.", adminActor, new Date(), 0);

export class Fixtures1504987869455 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const actorRepository = queryRunner.manager.getRepository(Actor);
    const roleRepository = queryRunner.manager.getRepository(Role);
    const pageRepository = queryRunner.manager.getRepository(Page);
    await actorRepository.save(adminActor);
    await roleRepository.save(defaultRole);
    await pageRepository.save(defaultPage);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    const actorRepository = queryRunner.manager.getRepository(Actor);
    const roleRepository = queryRunner.manager.getRepository(Role);
    const pageRepository = queryRunner.manager.getRepository(Page);
    await pageRepository.delete(defaultPage);
    await roleRepository.delete(defaultRole);
    await actorRepository.delete(adminActor);
  }
}
