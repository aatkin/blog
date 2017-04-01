import * as express from "express";
import { ApiRoute } from "./routes/ApiRoute";

export class Server {
    public app: express.Application;

    constructor(app?: express.Application, config?: (app: express.Application) => void, routes?: (app: express.Application) => void) {
        // create app instance
        this.app = app ? app : express();
        // configure app
        config ? config(this.app) : this.config();
        // set routes for app
        routes ? routes(this.app) : this.routes();
    }

    public start(port: Number, callback: Function): void {
        this.app.listen(port, callback);
    }

    private config(): void {

    }

    private routes(): void {
        this.app.use("/api", new ApiRoute().router);
    }
}
