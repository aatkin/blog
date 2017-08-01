import { Connection } from "typeorm";

import { Logger } from "./utils";
import { DatabaseManager } from "./DatabaseManager";
import { Server } from "./Server";


let connection: Connection;

async function startup()
{
    try
    {
        Logger.info("Starting back-end");

        // establish db connection
        connection = await DatabaseManager.createConnection();

        // dev only
        await DatabaseManager.useFixtures();

        const application = Server.bootstrap();
        application.start(4730, () =>
        {
            Logger.info("Server running on port 4730");
        });
    }
    catch (e)
    {
        Logger.error(`Unhandled exception: ${String(e)}`);
        process.exit(1);
    }
}

process.on("exit", () => {
    Logger.info("Shutting down back-end");

    if (typeof connection !== "undefined" && connection !== null)
    {
        Logger.debug("Closing active database connections");
        connection.close();
    }
});

startup();
