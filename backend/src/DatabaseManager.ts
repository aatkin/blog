import "reflect-metadata";
import { createConnection, Connection } from "typeorm";

import { Logger, fixtures } from "./utils";


class DBManager
{
    public connection: Connection;

    public async createConnection(): Promise<Connection>
    {
        try
        {
            this.connection = await createConnection("dev");
            Logger.debug("Connected to database");
            return this.connection;
        }
        catch (e)
        {
            Logger.error(`Error trying to connect to database: ${String(e)}`);
            throw e;
        }
    }

    public async useFixtures()
    {
        try
        {
            Logger.warn("Using fixtures - THIS WILL CLEAR YOUR CURRENT DATABASE!");
            await this.connection.dropDatabase();
            await this.connection.syncSchema();
            await fixtures();
            Logger.debug("Fixtures loaded successfully");
        }
        catch (e)
        {
            Logger.error(`Error loading fixtures to database: ${String(e)}`);
        }
    }
}

const DatabaseManager = new DBManager();

export { DatabaseManager };
