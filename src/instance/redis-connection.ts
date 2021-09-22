import { RedisConnection } from "@lindorm-io/redis";
import { config } from "../config";
import { winston } from "../logger";

export const redisConnection = new RedisConnection({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  password: config.REDIS_PASSWORD,
  winston,
});
