import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../typing";
import { InvalidChallengeError, InvalidPermissionError } from "../error";
import { TNext } from "@lindorm-io/koa";
import { stringComparison } from "@lindorm-io/core";

const schema = Joi.object({
  challengeId: Joi.string().guid().required(),
});

export const challengeMiddleware = async (ctx: IKoaDeviceContext, next: TNext) => {
  const start = Date.now();

  const { cache, device, logger } = ctx;
  const { challengeId } = ctx.request.body;

  await schema.validateAsync({ challengeId });

  try {
    ctx.challenge = await cache.challenge.find(challengeId);

    if (!stringComparison(ctx.challenge.deviceId, device.id)) {
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
