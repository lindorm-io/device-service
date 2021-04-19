import Joi from "@hapi/joi";
import { IKoaDeviceContext, IVerifyChallengeData, IVerifyChallengeWithSecretOptions } from "../../typing";
import { JOI_STRATEGY } from "../../constant";

const schema = Joi.object({
  certificateVerifier: Joi.string().required(),
  secret: Joi.string().required(),
  strategy: JOI_STRATEGY,
});

export const verifyChallengeWithSecret = (ctx: IKoaDeviceContext) => async (
  options: IVerifyChallengeWithSecretOptions,
): Promise<IVerifyChallengeData> => {
  await schema.validateAsync(options);

  const { logger } = ctx;
  const { device } = ctx.entity;
  const { challengeHandler, deviceHandler } = ctx.handler;
  const { certificateVerifier, secret, strategy } = options;

  await challengeHandler.assert(strategy, certificateVerifier);
  await deviceHandler.assertSecret(secret);

  logger.debug("certificate challenge with secret verified", {
    accountId: device.accountId,
    deviceId: device.id,
  });

  return {
    challengeConfirmation: challengeHandler.getConfirmationToken(),
  };
};
