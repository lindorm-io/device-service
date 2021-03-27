import { IKoaDeviceContext, TNext } from "../typing";
import { ChallengeCache, EnrolmentCache } from "../infrastructure";
import { CHALLENGE_EXPIRY, ENROLMENT_EXPIRY } from "../config";
import { stringToSeconds } from "@lindorm-io/core";

export const cacheMiddleware = async (ctx: IKoaDeviceContext, next: TNext): Promise<void> => {
  const start = Date.now();

  const { redis, logger } = ctx;
  const client = await redis.getClient();

  ctx.cache = {
    ...ctx.cache,
    challenge: new ChallengeCache({
      client,
      expiresInSeconds: stringToSeconds(CHALLENGE_EXPIRY) + 60,
      logger,
    }),
    enrolment: new EnrolmentCache({
      client,
      expiresInSeconds: stringToSeconds(ENROLMENT_EXPIRY) + 60,
      logger,
    }),
  };

  logger.debug("redis cache connected");

  ctx.metrics = {
    ...(ctx.metrics || {}),
    cache: Date.now() - start,
  };

  await next();
};
