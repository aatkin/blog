import { injectable, inject } from "inversify";
import { createConnection, Connection } from "typeorm";
import * as config from "config";

import { Types } from "src/Types";
import { ILoggerService } from "src/services/LoggerService";

export interface IDatabaseService {
  connection: Connection | null;
  createConnection(): Promise<Connection>;
}

@injectable()
export class DatabaseService implements IDatabaseService {
  public connection: Connection | null = null;

  constructor(@inject(Types.Logger) private logger: ILoggerService) {}

  public async createConnection(): Promise<Connection> {
    try {
      this.connection = await createConnection();
      this.logger.debug("Connected to database!");
      await this.connection.synchronize(true);
      this.logger.debug("Synchronized with database!");

      if (config.get<boolean>("database.migrations")) {
        this.logger.debug("Running migrations");
        await this.connection.runMigrations();
        this.logger.debug("Migrations run succesfully");
      }

      return this.connection;
    } catch (e) {
      this.logger.error(`Error trying to connect to database: ${String(e)}`);
      throw e;
    }
  }
}
