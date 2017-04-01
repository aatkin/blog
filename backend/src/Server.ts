import * as express from "express";
import { ApiRoute } from "./routes/ApiRoute";

export class Server {
    public app: express.Application;

    constructor(app?: express.Application, config?: Function, routes?: Function) {
        // create app instance
        this.app = app ? app : express();
        // configure app
        config ? config() : this.config();
        // set routes for app
        routes ? routes() : this.routes();
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
