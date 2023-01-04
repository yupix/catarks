import { PrismaClient } from "@catarks/db";
import { config } from "@catarks/shared";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const Redis = require("ioredis");
import type { RedisOptions, Redis as TRedis } from "ioredis";

export class ORM {
  private static _instance: PrismaClient;
  private constructor() {}

  public static instance(): PrismaClient {
    if (!this._instance) {
      this._instance = new PrismaClient();
      return this._instance;
    }
    return this._instance;
  }
}

export const redis: TRedis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
} as RedisOptions);
