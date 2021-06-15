import { ChallengeSessionCache, EnrolmentSessionCache } from "../infrastructure";
import { KeyPairCache } from "@lindorm-io/koa-keystore";
import { cacheMiddleware } from "@lindorm-io/koa-redis";
import { config } from "../config";
import { stringToSeconds } from "@lindorm-io/core";

export const challengeSessionCacheMiddleware = cacheMiddleware(ChallengeSessionCache, {
  expiresInSeconds: stringToSeconds(config.CHALLENGE_SESSION_EXPIRY),
});

export const enrolmentSessionCacheMiddleware = cacheMiddleware(EnrolmentSessionCache, {
  expiresInSeconds: stringToSeconds(config.ENROLMENT_SESSION_EXPIRY),
});

export const keyPairCacheMiddleware = cacheMiddleware(KeyPairCache);
