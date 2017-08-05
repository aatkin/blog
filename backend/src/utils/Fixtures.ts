import { Connection } from "typeorm";
import * as uuid from "uuid/v4";
import * as bcrypt from "bcrypt";

import { DatabaseService } from "../DatabaseService";
import { Role, User } from "../models";


export async function fixtures(connection: Connection)
{
    const userRepository = connection.getRepository(User);
    const roleRepository = connection.getRepository(Role);

    const role: Role = {
        guid: uuid(),
        name: "Admin",
        value: "ADMIN"

    };
    await roleRepository.persist(role);

    const user: User = {
            guid: uuid(),
            name: "Testikäyttäjä",
            password: await bcrypt.hash("blogAdmin", await bcrypt.genSalt()),
            isFixture: true,
            role
    };
    await userRepository.persist(user);
}

export async function getUserFixtures(connection: Connection): Promise<User[]>
{
    const userRepository = connection.getRepository(User);
    const fixtureUsers = await userRepository.find({ isFixture: true });
    return fixtureUsers;
}
