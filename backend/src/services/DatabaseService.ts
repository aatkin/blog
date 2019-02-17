import { injectable, inject } from "inversify";
import { createConnection, Connection } from "typeorm";
import * as redis from "redis";
import * as config from "config";

import { Types } from "src/Types";
import { ILoggerService } from "src/services/LoggerService";
import { Time } from "src/constants/Time";

export interface IDatabaseService {
  redis: RedisClient;
  connection: Connection;
  createConnections(): Promise<Connection>;
  clearCacheFor(keys: string[]): Promise<void>;
}

@injectable()
export class DatabaseService implements IDatabaseService {
  public get redis() {
    return this._redis;
  }
  public get connection() {
    return this._connection;
  }

  // @ts-ignore
  private _redis: RedisClient;
  // @ts-ignore
  private _connection: Connection;

  constructor(@inject(Types.Logger) private logger: ILoggerService) {}

  public async createConnections(): Promise<Connection> {
    try {
      this._connection = await createConnection();
      this.logger.debug("Connected to database!");
      await this._connection.dropDatabase();
      this.logger.debug("Dropped database!");
      await this._connection.synchronize(true);
      this.logger.debug("Synchronized with database!");

      const client = await this.createRedisClient();
      this._redis = new RedisClient(client, this.logger);
      this.logger.debug("Connected to Redis!");

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

  public async clearCacheFor(keys: string[]) {
    const queryResultCache = this._connection.queryResultCache;
    if (queryResultCache) {
      this.logger.debug(`Clearing typeorm cache for keys ${JSON.stringify(keys)}`);
      await queryResultCache.remove(keys);
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
      });
    });
  }
}

// Async wrapper around node-redis client
class RedisClient {
  constructor(private client: redis.RedisClient, private logger: ILoggerService) {}

  public async set(key: string, value: string, expire: number) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, "EX", expire, (err, _reply) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  public async getKeys() {
    return new Promise<string[]>((resolve, reject) => {
      this.client.keys("*", (err, reply) => {
        if (err) {
          return reject(err);
        }
        resolve(reply);
      });
    });
  }

  public async getKey(key: string) {
    return new Promise<string>((resolve, reject) => {
      this.client.get(key, (err, reply) => {
        if (err) {
          return reject(err);
        }
        resolve(reply);
      });
    });
  }

  public async getTTL(key: string) {
    return new Promise<number>((resolve, reject) => {
      this.client.ttl(key, (err, reply) => {
        if (err) {
          return reject(err);
        }
        resolve(reply);
      });
    });
  }

  public async setTTL(key: string, expire: Time) {
    this.logger.debug(`Extending TTL for token: ${key}, expire: ${expire}`);
    return new Promise<number>((resolve, reject) => {
      this.client.expire(key, expire, (err, reply) => {
        if (err) {
          return reject(err);
        }
        resolve(reply);
      });
    });
  }
}
