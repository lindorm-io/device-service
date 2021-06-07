import { KeyPairCache } from "@lindorm-io/koa-keystore";
import { cacheMiddleware } from "@lindorm-io/koa-redis";

export const keyPairCacheMiddleware = cacheMiddleware(KeyPairCache);
