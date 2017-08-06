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

    const user_1: User = {
            guid: uuid(),
            name: "Administrator",
            password: await bcrypt.hash("admin123", await bcrypt.genSalt()),
            isFixture: true,
            role
    };
    const user_2: User = {
            guid: uuid(),
            name: "Nasse",
            password: await bcrypt.hash("nasse123", await bcrypt.genSalt()),
            isFixture: true,
            role
    };
    await userRepository.persist(user_1);
    await userRepository.persist(user_2);
}
