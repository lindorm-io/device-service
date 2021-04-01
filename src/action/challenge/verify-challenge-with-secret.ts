import Joi from "@hapi/joi";
import { IKoaDeviceContext, IVerifyChallengeData, IVerifyChallengeWithSecretOptions } from "../../typing";
import { JOI_STRATEGY } from "../../constant";
import { assertChallenge, assertDeviceSecret, getChallengeConfirmationToken } from "../../support";

const schema = Joi.object({
  certificateVerifier: Joi.string().required(),
  challengeId: Joi.string().guid().required(),
  secret: Joi.string().required(),
  strategy: JOI_STRATEGY,
});

export const verifyChallengeWithSecret = (ctx: IKoaDeviceContext) => async (
  options: IVerifyChallengeWithSecretOptions,
): Promise<IVerifyChallengeData> => {
  await schema.validateAsync(options);

  const { device, logger } = ctx;
  const { certificateVerifier, challengeId, secret, strategy } = options;

  const challenge = await assertChallenge(ctx)({ challengeId, certificateVerifier, strategy });

  await assertDeviceSecret(device, secret);

  logger.debug("certificate challenge with secret verified", {
    accountId: device.accountId,
    deviceId: device.id,
  });

  return {
    challengeConfirmation: getChallengeConfirmationToken(ctx)({ challenge, device }),
  };
};
