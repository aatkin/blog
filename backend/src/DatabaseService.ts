import { injectable, inject } from "inversify";
import { createConnection, Connection } from "typeorm";
import * as uuid from "uuid/v4";

import { Types } from "./Types";
import { ILogger, fixtures } from "./utils";
import { Role, User } from "./models";


export interface IDatabaseService
{
    connection: Connection;
    createConnection(): Promise<Connection>;
    useFixtures(): Promise<void>;
}

@injectable()
export class DatabaseService implements IDatabaseService
{
    public connection: Connection;

    constructor(@inject(Types.Logger) private logger: ILogger) {}

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
            this.logger.warn("Loading fixtures into database");
            await fixtures(this.connection);
            this.logger.debug("Fixtures loaded successfully");
        }
        catch (e)
        {
            this.logger.error(`Error loading fixtures to database: ${String(e)}`);
        }
    }
}
