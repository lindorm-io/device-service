import { REDIS_CONNECTION_OPTIONS } from "../config";
import { RedisConnection, RedisConnectionType } from "@lindorm-io/redis";
import { inMemoryCache } from "./in-memory";

export const getTestRedis = async (): Promise<RedisConnection> => {
  const redis = new RedisConnection({
    ...REDIS_CONNECTION_OPTIONS,
    type: RedisConnectionType.MEMORY,
    inMemoryCache,
  });
  await redis.connect();
  return redis;
};
