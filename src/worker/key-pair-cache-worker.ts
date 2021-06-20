import { MONGO_CONNECTION_OPTIONS, REDIS_CONNECTION_OPTIONS } from "../config";
import { keyPairMongoCacheWorker } from "@lindorm-io/koa-keystore";
import { winston } from "../logger";

export const keyPairCacheWorker = keyPairMongoCacheWorker({
  mongoConnectionOptions: MONGO_CONNECTION_OPTIONS,
  redisConnectionOptions: REDIS_CONNECTION_OPTIONS,
  winston,
});
