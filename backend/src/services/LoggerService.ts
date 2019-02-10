import { injectable } from "inversify";
import * as path from "path";
import { createLogger, Logger, transports, format } from "winston";
import * as config from "config";

import { Exception } from "src/exceptions/Exception";

export interface ILoggerService {
  error(message: string): void;
  warn(message: string): void;
  info(message: string): void;
  verbose(message: string): void;
  debug(message: string): void;
  silly(message: string): void;
  logException(e: Error): void;
}

@injectable()
export class LoggerService implements ILoggerService {
  private _logger: Logger;

  constructor() {
    const logFilePath: string = config.get("logger.filepath");
    const logLevel: string = config.get("logger.level");

    this._logger = createLogger({
      format: format.combine(format.timestamp(), format.prettyPrint()),
      transports: [
        new transports.Console({
          level: "debug",
          format: format.combine(format.colorize(), format.simple())
        }),
        new transports.File({
          level: logLevel,
          filename: path.resolve("./", logFilePath)
        })
      ]
    });
  }

  public error(message: string) {
    this._logger.error(message);
  }
  public warn(message: string) {
    this._logger.warn(message);
  }
  public info(message: string) {
    this._logger.info(message);
  }
  public verbose(message: string) {
    this._logger.verbose(message);
  }
  public debug(message: string) {
    this._logger.debug(message);
  }
  public silly(message: string) {
    this._logger.silly(message);
  }

  public logException<T extends Exception | Error>(e: T) {
    if (e instanceof Exception) {
      const formattedStack = e.stackTrace.join("\n----------\n");
      this._logger.error(e.name + ": " + e.message + "\n" + formattedStack);
    } else {
      this._logger.error(e.name + ": " + e.message + "\n" + e.stack);
    }
  }
}
