import "reflect-metadata";
import { Connection } from "typeorm";

// container should be imported first..?
import { container } from "src/inversify.config";

import { ILoggerService } from "src/services/LoggerService";
import { IDatabaseService } from "src/services/DatabaseService";
import { Server } from "src/Server";
import { Types } from "src/Types";

let connection: Connection;

const logger = container.get<ILoggerService>(Types.Logger);
const databaseService = container.get<IDatabaseService>(Types.DatabaseService);

async function startup() {
  try {
    logger.info("Starting back-end");

    // establish db connection
    connection = await databaseService.createConnection();

    const application = Server.bootstrap(container);
    application.start(4730, () => {
      logger.info("Server running on port 4730");
    });
  } catch (e) {
    logger.error(`Unhandled exception: ${String(e)}`);
    console.log(e);
    process.exit(1);
  }
}

process.on("exit", () => {
  logger.info("Shutting down back-end");

  if (typeof connection !== "undefined" && connection !== null) {
    logger.debug("Closing active database connections");
    connection.close();
  }
});

startup();
