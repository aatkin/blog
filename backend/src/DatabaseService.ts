import { injectable, inject } from "inversify";
import { createConnection, Connection } from "typeorm";
import * as uuid from "uuid/v4";
import * as config from "config";

import { Types } from "./Types";
import { ILogger } from "./utils/Logging";


export interface IDatabaseService
{
    connection: Connection;
    createConnection(): Promise<Connection>;
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
            this.connection = await createConnection();
            this.logger.debug("Connected to database!");

            if (config.get<boolean>("database.migrations"))
            {
                this.logger.debug("Running migrations");
                await this.connection.runMigrations();
                this.logger.debug("Migrations run succesfully");
            }

            return this.connection;
        }
        catch (e)
        {
            this.logger.error(`Error trying to connect to database: ${String(e)}`);
            throw e;
        }
    }
}
