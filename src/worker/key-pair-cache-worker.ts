import { config } from "../config";
import { mongoConnection, redisConnection } from "../instance";
import { winston } from "../logger";
import {
  keyPairJwksCacheWorker,
  keyPairMongoCacheWorker,
} from "@lindorm-io/koa-keystore";

export const keyPairJwksWorker = keyPairJwksCacheWorker({
  baseUrl: config.BEARER_TOKEN_ISSUER,
  clientName: "BearerTokenIssuer",
  redisConnection,
  winston,
});

export const keyPairCacheWorker = keyPairMongoCacheWorker({
  mongoConnection,
  redisConnection,
  winston,
});
