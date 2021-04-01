import { ChallengeCache, EnrolmentCache } from "../infrastructure";
import { IKoaDeviceContext } from "../typing";
import { TNext } from "@lindorm-io/koa";
import { config } from "../config";
import { stringToSeconds } from "@lindorm-io/core";

export const cacheMiddleware = async (ctx: IKoaDeviceContext, next: TNext): Promise<void> => {
  const start = Date.now();

  const { redis, logger } = ctx;
  const client = await redis.getClient();

  ctx.cache = {
    ...ctx.cache,
    challenge: new ChallengeCache({
      client,
      expiresInSeconds: stringToSeconds(config.CHALLENGE_EXPIRY) + 60,
      logger,
    }),
    enrolment: new EnrolmentCache({
      client,
      expiresInSeconds: stringToSeconds(config.ENROLMENT_EXPIRY) + 60,
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
