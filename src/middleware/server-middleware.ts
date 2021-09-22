import { cacheMiddleware, redisMiddleware } from "@lindorm-io/koa-redis";
import { config } from "../config";
import { mongoConnection, redisConnection } from "../instance";
import { mongoMiddleware, repositoryMiddleware } from "@lindorm-io/koa-mongo";
import { tokenIssuerMiddleware } from "@lindorm-io/koa-jwt";
import {
  cacheKeysMiddleware,
  KeyPairCache,
  KeyPairRepository,
  keystoreMiddleware,
} from "@lindorm-io/koa-keystore";
import {
  ChallengeSessionCache,
  DeviceRepository,
  EnrolmentSessionCache,
} from "../infrastructure";

export const serverMiddlewares = [
  // Repository

  mongoMiddleware(mongoConnection),
  repositoryMiddleware(DeviceRepository),
  repositoryMiddleware(KeyPairRepository),

  // Cache

  redisMiddleware(redisConnection),
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
