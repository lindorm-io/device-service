import Joi from "@hapi/joi";
import { IKoaDeviceContext, IVerifyChallengeData, IVerifyChallengeWithPinOptions } from "../../typing";
import { JOI_STRATEGY } from "../../constant";
import { assertChallenge, assertDevicePIN, getChallengeConfirmationToken } from "../../support";

const schema = Joi.object({
  certificateVerifier: Joi.string().required(),
  challengeId: Joi.string().guid().required(),
  pin: Joi.string().length(6).required(),
  strategy: JOI_STRATEGY,
});

export const verifyChallengeWithPin = (ctx: IKoaDeviceContext) => async (
  options: IVerifyChallengeWithPinOptions,
): Promise<IVerifyChallengeData> => {
  await schema.validateAsync(options);

  const { device, logger } = ctx;
  const { certificateVerifier, challengeId, pin, strategy } = options;

  const challenge = await assertChallenge(ctx)({ challengeId, certificateVerifier, strategy });

  await assertDevicePIN(device, pin);

  logger.debug("certificate challenge with pin verified", {
    accountId: device.accountId,
    deviceId: device.id,
  });

  return {
    challengeConfirmation: getChallengeConfirmationToken(ctx)({ challenge, device }),
  };
};
