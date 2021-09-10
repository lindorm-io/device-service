import { config, MONGO_CONNECTION_OPTIONS, REDIS_CONNECTION_OPTIONS } from "../config";
import { winston } from "../logger";
import {
  keyPairJwksCacheWorker,
  keyPairMongoCacheWorker,
} from "@lindorm-io/koa-keystore";

export const keyPairJwksWorker = keyPairJwksCacheWorker({
  baseUrl: config.BEARER_TOKEN_ISSUER,
  clientName: "BearerTokenIssuer",
  redisConnectionOptions: REDIS_CONNECTION_OPTIONS,
  winston,
});

export const keyPairCacheWorker = keyPairMongoCacheWorker({
  mongoConnectionOptions: MONGO_CONNECTION_OPTIONS,
  redisConnectionOptions: REDIS_CONNECTION_OPTIONS,
  winston,
});
