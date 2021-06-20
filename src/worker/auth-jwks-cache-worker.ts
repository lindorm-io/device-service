import { REDIS_CONNECTION_OPTIONS, config } from "../config";
import { keyPairJwksCacheWorker } from "@lindorm-io/koa-keystore";
import { winston } from "../logger";

export const authJwksCacheWorker = keyPairJwksCacheWorker({
  baseUrl: config.AUTH_WEB_KEY_HOST,
  clientName: "Authentication",
  redisConnectionOptions: REDIS_CONNECTION_OPTIONS,
  winston,
});
