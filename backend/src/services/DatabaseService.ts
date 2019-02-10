import { injectable, inject } from "inversify";
import { createConnection, Connection } from "typeorm";
import * as redis from "redis";
import * as config from "config";

import { Types } from "src/Types";
import { ILoggerService } from "src/services/LoggerService";

export interface IDatabaseService {
  redis: RedisClient;
  connection: Connection;
  createConnections(): Promise<Connection>;
}

@injectable()
export class DatabaseService implements IDatabaseService {
  public get redis() { return this._redis; }
  public get connection() { return this._connection; }

  private _redis: RedisClient;
  private _connection: Connection | null = null;

  constructor(@inject(Types.Logger) private logger: ILoggerService) {}

  public async createConnections(): Promise<Connection> {
    try {
      this._connection = await createConnection();
      this.logger.debug("Connected to database!");
      await this._connection.synchronize(true);
      this.logger.debug("Synchronized with database!");

      const client = await this.createRedisClient();
      this._redis = new RedisClient(client);
      this.logger.debug("Connected to Redis!")

      if (config.get<boolean>("database.migrations")) {
        this.logger.debug("Running migrations");
        await this._connection.runMigrations();
        this.logger.debug("Migrations run succesfully");
      }

      return this._connection;
    } catch (e) {
      this.logger.error(`Error trying to connect to database: ${String(e)}`);
      throw e;
    }
  }

  private async createRedisClient(): Promise<redis.RedisClient> {
    return new Promise((resolve, reject) => {
      const client = redis.createClient();
      client.on("connect", () => {
        resolve(client);
      });
      client.on("error", () => {
        reject();
      })
    })
  }
}

class RedisClient {
  constructor(private client: redis.RedisClient) {}

  public async set(key: string, value: string, expire: number) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, "EX", expire, (err, _reply) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    })
  }

  public async getKeys() {
    return new Promise<string[]>((resolve, reject) => {
      this.client.keys("*", (err, reply) => {
        if (err) {
          return reject(err);
        }
        // wildcard search returns string[] but the interface doesn't know it
        // so we need to do some ugly typecasting
        resolve(reply as unknown as string[]);
      });
    })
  }

  public async getKey(key: string) {
    return new Promise<string>((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
          return reject(err);
        }
        // wildcard search returns string[] but the interface doesn't know it
        // so we need to do some ugly typecasting
        resolve(reply);
      });
    })
  }

  public async getTTL(key: string) {
    return new Promise<number>((resolve, reject) => {
      this.client.ttl(key, (err, reply) => {
        if (err) {
          return reject(err);
        }
        // wildcard search returns string[] but the interface doesn't know it
        // so we need to do some ugly typecasting
        resolve(reply);
      });
    })
  }
}
