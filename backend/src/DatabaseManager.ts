import { injectable, inject } from "inversify";
import { createConnection, Connection } from "typeorm";
import * as uuid from "uuid/v4";

import { Logger, fixtures } from "./utils";
import { Role, User } from "./models";


@injectable()
export class DatabaseManager
{
    public connection: Connection;

    constructor(private logger: Logger) {}

    public async createConnection(): Promise<Connection>
    {
        try
        {
            this.connection = await createConnection("dev");
            this.logger.debug("Connected to database");
            return this.connection;
        }
        catch (e)
        {
            this.logger.error(`Error trying to connect to database: ${String(e)}`);
            throw e;
        }
    }

    public async useFixtures()
    {
        try
        {
            this.logger.warn("Using fixtures - THIS WILL CLEAR YOUR CURRENT DATABASE!");
            await this.connection.dropDatabase();
            await this.connection.syncSchema();

            const userRepository = this.connection.getRepository(User);
            const roleRepository = this.connection.getRepository(Role);

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

            this.logger.debug("Fixtures loaded successfully");
        }
        catch (e)
        {
            this.logger.error(`Error loading fixtures to database: ${String(e)}`);
        }
    }
}
