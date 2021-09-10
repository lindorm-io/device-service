import {
  config,
  IS_TEST,
  MONGO_CONNECTION_OPTIONS,
  REDIS_CONNECTION_OPTIONS,
} from "../config";
import { MongoConnectionType } from "@lindorm-io/mongo";
import { inMemoryCache, inMemoryStore } from "../test";
import { mongoMiddleware, repositoryMiddleware } from "@lindorm-io/koa-mongo";
import {
  cacheKeysMiddleware,
  KeyPairCache,
  KeyPairRepository,
  keystoreMiddleware,
} from "@lindorm-io/koa-keystore";
import { RedisConnectionType } from "@lindorm-io/redis";
import { cacheMiddleware, redisMiddleware } from "@lindorm-io/koa-redis";
import {
  ChallengeSessionCache,
  DeviceRepository,
  EnrolmentSessionCache,
} from "../infrastructure";
import { tokenIssuerMiddleware } from "@lindorm-io/koa-jwt";

export const serverMiddlewares = [
  // Repository

  mongoMiddleware({
    ...MONGO_CONNECTION_OPTIONS,
    type: IS_TEST ? MongoConnectionType.MEMORY : MONGO_CONNECTION_OPTIONS.type,
    inMemoryStore: IS_TEST ? inMemoryStore : undefined,
  }),
  repositoryMiddleware(DeviceRepository),
  repositoryMiddleware(KeyPairRepository),

  // Cache

  redisMiddleware({
    ...REDIS_CONNECTION_OPTIONS,
    type: IS_TEST ? RedisConnectionType.MEMORY : REDIS_CONNECTION_OPTIONS.type,
    inMemoryCache: IS_TEST ? inMemoryCache : undefined,
  }),
  cacheMiddleware(ChallengeSessionCache),
  cacheMiddleware(EnrolmentSessionCache),
  cacheMiddleware(KeyPairCache),

  // JWT

  cacheKeysMiddleware,
  keystoreMiddleware,
  tokenIssuerMiddleware({
    issuer: config.BEARER_TOKEN_ISSUER,
  }),
];
