import "reflect-metadata";
import { Connection } from "typeorm";

// container should be imported first..?
import { container } from "./inversify.config";

import { Logger } from "./utils";
import { DatabaseManager, Server } from "./";


let connection: Connection;

const logger = container.get(Logger);
const databaseService = container.get(DatabaseManager);

async function startup()
{
    try
    {
        logger.info("Starting back-end");

        // establish db connection
        connection = await databaseService.createConnection();

        // dev fixtures reset database
        await databaseService.useFixtures();

        const application = Server.bootstrap(container);
        application.start(4730, () =>
        {
            logger.info("Server running on port 4730");
        });
    }
    catch (e)
    {
        logger.error(`Unhandled exception: ${String(e)}`);
        console.log(e);
        process.exit(1);
    }
}

process.on("exit", () => {
    logger.info("Shutting down back-end");

    if (typeof connection !== "undefined" && connection !== null)
    {
        logger.debug("Closing active database connections");
        connection.close();
    }
});

startup();
