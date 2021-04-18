import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../typing";
import { InvalidChallengeError, InvalidPermissionError } from "../error";
import { Next } from "@lindorm-io/koa";
import { stringComparison } from "@lindorm-io/core";

const schema = Joi.object({
  challengeId: Joi.string().guid().required(),
});

export const challengeMiddleware = async (ctx: IKoaDeviceContext, next: Next) => {
  const start = Date.now();

  const { cache, entity, logger } = ctx;
  const { challengeId } = ctx.request.body;

  await schema.validateAsync({ challengeId });

  try {
    ctx.entity.challenge = await cache.challengeCache.find(challengeId);

    if (!stringComparison(ctx.entity.challenge.deviceId, entity.device.id)) {
      throw new InvalidPermissionError();
    }

    logger.debug("challenge found", { challengeId });
  } catch (err) {
    throw new InvalidChallengeError(challengeId, err);
  }

  ctx.metrics = {
    ...(ctx.metrics || {}),
    challenge: Date.now() - start,
  };

  await next();
};
