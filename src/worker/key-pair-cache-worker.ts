import { MONGO_CONNECTION_OPTIONS, REDIS_CONNECTION_OPTIONS } from "../config";
import { keyPairMongoCacheWorker } from "@lindorm-io/koa-keystore";
import { stringToSeconds } from "@lindorm-io/core";
import { winston } from "../logger";
import { DEVICE_KEYSTORE_NAME } from "../constant";

export const keyPairCacheWorker = keyPairMongoCacheWorker({
  keystoreName: DEVICE_KEYSTORE_NAME,
  mongoConnectionOptions: MONGO_CONNECTION_OPTIONS,
  redisConnectionOptions: REDIS_CONNECTION_OPTIONS,
  winston,
  workerIntervalInSeconds: stringToSeconds("5 minutes"),
});
