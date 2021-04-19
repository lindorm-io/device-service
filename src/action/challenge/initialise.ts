import Joi from "@hapi/joi";
import { IInitialiseChallengeData, IInitialiseChallengeOptions, IKoaDeviceContext } from "../../typing";
import { JOI_STRATEGY } from "../../constant";

const schema = Joi.object({
  scope: Joi.string().required(),
  strategy: JOI_STRATEGY,
});

export const initialiseChallenge = (ctx: IKoaDeviceContext) => async (
  options: IInitialiseChallengeOptions,
): Promise<IInitialiseChallengeData> => {
  await schema.validateAsync(options);

  const { logger } = ctx;
  const { device } = ctx.entity;
  const { challengeHandler } = ctx.handler;
  const { scope, strategy } = options;

  const challenge = await challengeHandler.create(strategy, scope);

  logger.debug("certificate challenge initialised", {
    deviceId: device.id,
  });

  return {
    challengeId: challenge.id,
    certificateChallenge: challenge.certificateChallenge,
    expires: challenge.expires,
  };
};
