import "reflect-metadata";
import { createConnection, Connection } from "typeorm";


class DBManager
{
    public connection: Connection;

    public async createConnection(): Promise<Connection>
    {
        this.connection = await createConnection("dev");
        return this.connection;
    }
}

const DatabaseManager = new DBManager();

export { DatabaseManager };
