import {Connection, EntityManager, MigrationInterface, QueryRunner} from "typeorm";
import * as uuid from "uuid/v4";
import * as bcrypt from "bcrypt";

import { Role } from "../src/entities/Role";
import { Actor } from "../src/entities/Actor";
import { UserIdentity } from "../src/entities/UserIdentity";
import { Page } from "../src/entities/Page";


const adminRole = new Role(
    uuid(),
    "Admin",
    "ADMIN"
);

const defaultRole = new Role(
    "000000-e559-4273-a831-a23009effb7c",
    "User",
    "USER"
);



const pages = [
    new Page(
        uuid(),
        "Front page"
    )
];

const users = [
    new UserIdentity(
        uuid(),
        "Administrator",
        bcrypt.hashSync("admin123", bcrypt.genSaltSync()),
        true
    ),
    new UserIdentity(
        // hard-coded guid for dev purposes
        "59c1c9b6-e559-4273-a831-a23009effb7c",
        "Nasse",
        bcrypt.hashSync("nasse123", bcrypt.genSaltSync()),
        true
    )
];

const actors = [
    new Actor(
        uuid(),
        "Administrator",
        adminRole,
        users[0],
        pages
    ),
    new Actor(
        uuid(),
        "Nasse-setä",
        adminRole,
        users[1]
    )
];

export class Fixtures1504987869455 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const actorRepository = queryRunner.manager.getRepository(Actor);
        await actorRepository.save(actors[0]);
        await actorRepository.save(actors[1]);
        // const userRepository = connection.getRepository(UserIdentity);
        // const roleRepository = connection.getRepository(Role);
        // const pageRepository = connection.getRepository(Page);
        // await roleRepository.save(adminRole);
        // await roleRepository.save(defaultRole);
        // await userRepository.save(users);
        // await pageRepository.save(pages);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        // delete relations?
    }

}
