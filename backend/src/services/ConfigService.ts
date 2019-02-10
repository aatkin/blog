import { injectable } from "inversify";
import * as config from "config";

export interface IConfigService {
  get: <T = string>(key: ConfigKey) => T;
}

@injectable()
export class ConfigService {
  public get<T = string>(key: ConfigKey): T {
    return config.get(key);
  }
}

type ConfigKey = "logger.level" | "logger.filepath" | "authentication.jwtSecret" | "authentication.jwtSession" | "authentication.cacheKey" | "database.migrations"
