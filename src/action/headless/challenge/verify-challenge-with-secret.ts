import Joi from "@hapi/joi";
import { ChallengeStrategy } from "../../../enum";
import { IKoaDeviceContext } from "../../../typing";
import { JOI_STRATEGY } from "../../../constant";
import { assertChallenge, assertDeviceSecret } from "../../../support";

export interface IVerifyChallengeWithSecretOptions {
  certificateVerifier: string;
  challengeId: string;
  secret: string;
  strategy: ChallengeStrategy;
}

const schema = Joi.object({
  certificateVerifier: Joi.string().required(),
  challengeId: Joi.string().guid().required(),
  secret: Joi.string().required(),
  strategy: JOI_STRATEGY,
});

export const verifyChallengeWithSecret = (ctx: IKoaDeviceContext) => async (
  options: IVerifyChallengeWithSecretOptions,
): Promise<void> => {
  await schema.validateAsync(options);

  const { device, logger } = ctx;
  const { certificateVerifier, challengeId, secret, strategy } = options;

  await assertChallenge(ctx)({ challengeId, certificateVerifier, strategy });
  await assertDeviceSecret(device, secret);

  logger.debug("certificate challenge with secret verified", {
    accountId: device.accountId,
    deviceId: device.id,
  });
};
