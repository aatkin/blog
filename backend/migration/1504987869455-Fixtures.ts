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
    "ADMIN",
    []
);

const defaultRole = new Role(
    "000000-e559-4273-a831-a23009effb7c",
    "User",
    "USER",
    []
);

const actors = [
    new Actor(
        uuid(),
        "Administrator",
        adminRole
    ),
    new Actor(
        uuid(),
        "Nasse-setä",
        adminRole
    )
];

const users = [
    new UserIdentity(
        uuid(),
        "Administrator",
        bcrypt.hashSync("admin123", bcrypt.genSaltSync()),
        true,
        actors[0]
    ),
    new UserIdentity(
        // hard-coded guid for dev purposes
        "59c1c9b6-e559-4273-a831-a23009effb7c",
        "Nasse",
        bcrypt.hashSync("nasse123", bcrypt.genSaltSync()),
        true,
        actors[1]
    )
];

const pages = [
    new Page(
        uuid(),
        actors[0],
        "Front page"
    )
];

actors[0].pages = pages;

export class Fixtures1504987869455 implements MigrationInterface {

    public async up(queryRunner: QueryRunner, connection: Connection): Promise<any> {
        const actorRepository = connection.getRepository(Actor);
        const userRepository = connection.getRepository(UserIdentity);
        const roleRepository = connection.getRepository(Role);
        const pageRepository = connection.getRepository(Page);
        await roleRepository.persist(adminRole);
        await actorRepository.persist(actors);
        await userRepository.persist(users);
        await pageRepository.persist(pages);
    }

    public async down(queryRunner: QueryRunner, connection: Connection): Promise<any> {
        const actorRepository = connection.getRepository(Actor);
        const userRepository = connection.getRepository(UserIdentity);
        const roleRepository = connection.getRepository(Role);
        const pageRepository = connection.getRepository(Page);
        await pageRepository.remove(pages);
        await userRepository.remove(users);
        await actorRepository.remove(actors);
        await roleRepository.remove(adminRole);
    }

}
