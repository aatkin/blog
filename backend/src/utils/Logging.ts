import { injectable } from "inversify";
import * as path from "path";
import * as winston from "winston";

import * as config from "config";
import * as chalk from "chalk";


export interface ILogger
{
    error(...args: any[]): void;
    warn(...args: any[]): void;
    info(...args: any[]): void;
    verbose(...args: any[]): void;
    debug(...args: any[]): void;
    silly(...args: any[]): void;
}

@injectable()
export class Logger implements ILogger
{
    private _logger: winston.LoggerInstance;

    constructor()
    {
        const logFilePath: string = config.get("logger.filepath");
        const logLevel: string = config.get("logger.level");

        this._logger = new (winston.Logger)({
            transports: [
                new (winston.transports.Console)({
                    level: "debug",
                    colorize: true
                }),
                new (winston.transports.File)({
                    level: logLevel,
                    filename: path.resolve("./", logFilePath)
                })
            ]
        });
    }

    public error(...args: any[]) { this._logger.error.apply(null, args); }
    public warn(...args: any[]) { this._logger.warn.apply(null, args); }
    public info(...args: any[]) { this._logger.info.apply(null, args); }
    public verbose(...args: any[]) { this._logger.verbose.apply(null, args); }
    public debug(...args: any[]) { this._logger.debug.apply(null, args); }
    public silly(...args: any[]) { this._logger.silly.apply(null, args); }
}
