import * as express from "express";

import { Logger } from "./utils";
import { ApiRoute } from "./routes/Api";


/**
 * Back-end server class
 *
 * Initializes and configures an express instance, and attaches routes to it
 */
export class Server
{
    public app: express.Application;

    constructor(app?: express.Application, config?: (app: express.Application) => void, routes?: (app: express.Application) => void)
    {
        // create app instance
        this.app = app ? app : express();
        // configure app
        config ? config(this.app) : this.config();
        // set routes for app
        routes ? routes(this.app) : this.routes();
    }

    /**
     * Return a new server instance
     */
    public static bootstrap(): Server
    {
        return new Server();
    }

    /**
     * Start the server using given parameters
     */
    public start(port: Number, callback: Function): void
    {
        this.app.listen(port, callback);
    }

    private config(): void
    {
        this.app.use(this.logRequest.bind(this));
    }

    private routes(): void
    {
        this.app.use("/api", new ApiRoute().router);
    }

    private async logRequest(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        Logger.debug(`${req.method}: ${req.originalUrl}`);
        next();
    }
}
