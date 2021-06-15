import { ChallengeSessionCache, EnrolmentSessionCache } from "../infrastructure";
import { cacheMiddleware } from "@lindorm-io/koa-redis";
import { stringToSeconds } from "@lindorm-io/core";
import { config } from "../config";

export const challengeSessionCacheMiddleware = cacheMiddleware(ChallengeSessionCache, {
  expiresInSeconds: stringToSeconds(config.CHALLENGE_SESSION_EXPIRY),
});

export const enrolmentSessionCacheMiddleware = cacheMiddleware(EnrolmentSessionCache, {
  expiresInSeconds: stringToSeconds(config.ENROLMENT_SESSION_EXPIRY),
});
