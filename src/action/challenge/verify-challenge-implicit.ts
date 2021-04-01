import Joi from "@hapi/joi";
import { IKoaDeviceContext, IVerifyChallengeData, IVerifyChallengeOptions } from "../../typing";
import { JOI_STRATEGY } from "../../constant";
import { assertChallenge, getChallengeConfirmationToken } from "../../support";

const schema = Joi.object({
  certificateVerifier: Joi.string().required(),
  strategy: JOI_STRATEGY,
});

export const verifyChallengeImplicit = (ctx: IKoaDeviceContext) => async (
  options: IVerifyChallengeOptions,
): Promise<IVerifyChallengeData> => {
  await schema.validateAsync(options);

  const { device, logger } = ctx;
  const { certificateVerifier, strategy } = options;

  await assertChallenge(ctx)({ certificateVerifier, strategy });

  logger.debug("certificate challenge verified", {
    accountId: device.accountId,
    deviceId: device.id,
  });

  return {
    challengeConfirmation: getChallengeConfirmationToken(ctx)(),
  };
};
