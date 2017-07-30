import * as express from "express";


export abstract class Route
{
    public router: express.Router;

    constructor()
    {
        this.router = express.Router();
        this.attachRoutes(this.router);
    }

    protected abstract attachRoutes(router: express.Router): void;
}
