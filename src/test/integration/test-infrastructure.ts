import { MONGO_CONNECTION_OPTIONS, REDIS_CONNECTION_OPTIONS } from "../../config";
import { MongoConnection, MongoConnectionType } from "@lindorm-io/mongo";
import { RedisConnection, RedisConnectionType } from "@lindorm-io/redis";
import { inMemoryCache, inMemoryStore } from "./in-memory";

export const getTestRedis = async (): Promise<RedisConnection> => {
  const redis = new RedisConnection({
    ...REDIS_CONNECTION_OPTIONS,
    type: RedisConnectionType.MEMORY,
    inMemoryCache,
  });
  await redis.connect();
  return redis;
};

export const getTestMongo = async (): Promise<MongoConnection> => {
  const mongo = new MongoConnection({
    ...MONGO_CONNECTION_OPTIONS,
    type: MongoConnectionType.MEMORY,
    inMemoryStore,
  });
  await mongo.connect();
  return mongo;
};
