import Joi from "@hapi/joi";
import { IKoaDeviceContext, IVerifyChallengeData, IVerifyChallengeOptions } from "../../typing";
import { JOI_STRATEGY } from "../../constant";

const schema = Joi.object({
  certificateVerifier: Joi.string().required(),
  strategy: JOI_STRATEGY,
});

export const verifyChallengeImplicit = (ctx: IKoaDeviceContext) => async (
  options: IVerifyChallengeOptions,
): Promise<IVerifyChallengeData> => {
  await schema.validateAsync(options);

  const { logger } = ctx;
  const { device } = ctx.entity;
  const { challengeHandler } = ctx.handler;
  const { certificateVerifier, strategy } = options;

  await challengeHandler.assert(strategy, certificateVerifier);

  logger.debug("certificate challenge verified", {
    accountId: device.accountId,
    deviceId: device.id,
  });

  return {
    challengeConfirmation: challengeHandler.getConfirmationToken(),
  };
};
