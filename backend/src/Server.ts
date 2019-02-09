import { Container, injectable } from "inversify";
import * as express from "express";
import * as bodyParser from "body-parser";

import { Types } from "./Types";
import { ILoggerService } from "./services/LoggerService";
import { IAuthenticationController, AuthenticationCredentials } from "./controllers/AuthenticationController";
import { IApiRoute, ApiRoute } from "./routes/Api";


/**
 * Back-end server class
 *
 * Initializes and configures an express instance, and attaches routes to it
 */
export class Server
{
    public app: express.Application;

    constructor(
        private container: Container,
        app?: express.Application,
        config?: (app: express.Application) => void,
        routes?: (app: express.Application) => void)
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
    public static bootstrap(container: Container): Server
    {
        return new Server(container);
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
        this.app.use((req, res, next) =>
        {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        // log all requests
        this.app.use(this.logRequest.bind(this));
        // parse body from requests
        this.app.use(bodyParser.json());

        // use passport authentication
        const authenticationController = this.container.get<IAuthenticationController>(Types.AuthenticationController);
        this.app.use(authenticationController.initialize());
    }

    private routes(): void
    {
        const apiRoute = this.container.get<IApiRoute>(Types.ApiRoute);
        const authenticationController = this.container.get<IAuthenticationController>(Types.AuthenticationController);

        // routes
        this.app.use("/api",
            authenticationController.authenticate(),
            authenticationController.extractUserFromRequestFunction(),
            apiRoute.router);

        // authentication
        this.app.post("/authenticate", this.authenticate.bind(this));

        // error middleware
        this.app.use(this.handleError.bind(this));
    }

    private async logRequest(req: express.Request, res: express.Response, next: express.NextFunction)
    {
        const logger = this.container.get<ILoggerService>(Types.Logger);
        logger.debug(`${req.method}: ${req.originalUrl} - ${req.body}`);
        next();
    }

    private async authenticate(req: express.Request, res: express.Response)
    {
        if (req.body.userName && req.body.password)
        {
            const credentials: AuthenticationCredentials = {
                userName: req.body.userName,
                password: req.body.password
            };

            const authenticationService = this.container.get<IAuthenticationController>(Types.AuthenticationController);
            const token = await authenticationService.getTokenAsync(credentials);

            if (token !== null)
            {
                // authentication ok
                res.json({ token });
            }
            else
            {
                res.sendStatus(401);
            }
        }
        else
        {
            res.sendStatus(401);
        }
    }

    private async handleError(err: any, req: express.Request, res: express.Response, next: express.NextFunction)
    {
        // handle prod errors as well
        const logger = this.container.get<ILoggerService>(Types.Logger);
        logger.error(err);
        res.status(500).json({
             message: err.message,
             error: err
        });
    }
}
