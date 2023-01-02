import { PrismaClient } from "@catarks/db";
import { config } from "@catarks/shared";
import Redis from "ioredis";

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

export const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
});
