import Joi from "@hapi/joi";
import { IKoaDeviceContext, IVerifyChallengeData, IVerifyChallengeWithPinOptions } from "../../typing";
import { JOI_STRATEGY } from "../../constant";

const schema = Joi.object({
  certificateVerifier: Joi.string().required(),
  pin: Joi.string().length(6).required(),
  strategy: JOI_STRATEGY,
});

export const verifyChallengeWithPin = (ctx: IKoaDeviceContext) => async (
  options: IVerifyChallengeWithPinOptions,
): Promise<IVerifyChallengeData> => {
  await schema.validateAsync(options);

  const { logger } = ctx;
  const { device } = ctx.entity;
  const { challengeHandler, deviceHandler } = ctx.handler;
  const { certificateVerifier, pin, strategy } = options;

  await challengeHandler.assert(strategy, certificateVerifier);
  await deviceHandler.assertPin(pin);

  logger.debug("certificate challenge with pin verified", {
    accountId: device.accountId,
    deviceId: device.id,
  });

  return {
    challengeConfirmation: challengeHandler.getConfirmationToken(),
  };
};
