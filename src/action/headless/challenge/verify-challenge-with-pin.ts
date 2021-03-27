import Joi from "@hapi/joi";
import { ChallengeStrategy } from "../../../enum";
import { IKoaDeviceContext } from "../../../typing";
import { JOI_STRATEGY } from "../../../constant";
import { assertChallenge, assertDevicePIN } from "../../../support";

export interface IVerifyChallengeWithPinOptions {
  certificateVerifier: string;
  challengeId: string;
  pin: string;
  strategy: ChallengeStrategy;
}

const schema = Joi.object({
  certificateVerifier: Joi.string().required(),
  challengeId: Joi.string().guid().required(),
  pin: Joi.string().length(6).required(),
  strategy: JOI_STRATEGY,
});

export const verifyChallengeWithPin = (ctx: IKoaDeviceContext) => async (
  options: IVerifyChallengeWithPinOptions,
): Promise<void> => {
  await schema.validateAsync(options);

  const { device, logger } = ctx;
  const { certificateVerifier, challengeId, pin, strategy } = options;

  await assertChallenge(ctx)({ challengeId, certificateVerifier, strategy });
  await assertDevicePIN(device, pin);

  logger.debug("certificate challenge with pin verified", {
    accountId: device.accountId,
    deviceId: device.id,
  });
};
