import {Connection, EntityManager, MigrationInterface, QueryRunner} from "typeorm";
import * as uuid from "uuid/v4";
import * as bcrypt from "bcrypt";

import { Role, User } from "../src/entities";

const role = new Role(
    uuid(),
    "Admin",
    "ADMIN"
);

const defaultRole = new Role(
    "000000-e559-4273-a831-a23009effb7c",
    "User",
    "USER"
);

const user_1 = new User(
    uuid(),
    "Administrator",
    bcrypt.hashSync("admin123", bcrypt.genSaltSync()),
    true,
    role
);
const user_2 = new User(
    // hard-coded guid for dev purposes
    "59c1c9b6-e559-4273-a831-a23009effb7c",
    "Nasse",
    bcrypt.hashSync("nasse123", bcrypt.genSaltSync()),
    true,
    role
);


export class Fixtures1504987869455 implements MigrationInterface {

    public async up(queryRunner: QueryRunner, connection: Connection): Promise<any> {
        const userRepository = connection.getRepository(User);
        const roleRepository = connection.getRepository(Role);
        await roleRepository.persist(role);
        await userRepository.persist(user_1);
        await userRepository.persist(user_2);
    }

    public async down(queryRunner: QueryRunner, connection: Connection): Promise<any> {
        const userRepository = connection.getRepository(User);
        const roleRepository = connection.getRepository(Role);
        await userRepository.remove([user_1, user_2]);
        await roleRepository.remove(role);
    }

}
