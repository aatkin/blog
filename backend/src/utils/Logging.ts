import * as path from "path";
import * as winston from "winston";

import * as config from "config";
import * as chalk from "chalk";


// log file options
const logFilePath: string = config.get("logger.filepath");
const logLevel: string = config.get("logger.level");

const Logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: "debug",
            colorize: true
        }),
        new (winston.transports.File)({
            level: logLevel,
            filename: path.resolve("C:/koodit/blog/backend", logFilePath)
        })
    ]
});

export { Logger };
