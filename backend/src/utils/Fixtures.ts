import { Connection } from "typeorm";
import * as uuid from "uuid/v4";

import { DatabaseManager } from "../DatabaseManager";
import { Role, User } from "../models";


export async function fixtures()
{
    const connection = DatabaseManager.connection;

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
            role
    };
    await userRepository.persist(user);
}
