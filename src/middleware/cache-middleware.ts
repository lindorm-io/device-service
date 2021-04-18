import { ChallengeCache, EnrolmentCache } from "../infrastructure";
import { cacheMiddleware } from "@lindorm-io/koa-redis";
import { stringToSeconds } from "@lindorm-io/core";
import { config } from "../config";

export const challengeCacheMiddleware = cacheMiddleware(ChallengeCache, {
  expiresInSeconds: stringToSeconds(config.CHALLENGE_EXPIRY) + 60,
});

export const enrolmentCacheMiddleware = cacheMiddleware(EnrolmentCache, {
  expiresInSeconds: stringToSeconds(config.ENROLMENT_EXPIRY) + 60,
});
