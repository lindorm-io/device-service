import Joi from "@hapi/joi";
import { ChallengeStrategy } from "../../../enum";
import { IKoaDeviceContext } from "../../../typing";
import { JOI_STRATEGY } from "../../../constant";
import { assertChallenge } from "../../../support";

export interface IVerifyChallengeOptions {
  certificateVerifier: string;
  challengeId: string;
  strategy: ChallengeStrategy;
}

const schema = Joi.object({
  certificateVerifier: Joi.string().required(),
  challengeId: Joi.string().guid().required(),
  strategy: JOI_STRATEGY,
});

export const verifyChallenge = (ctx: IKoaDeviceContext) => async (options: IVerifyChallengeOptions): Promise<void> => {
  await schema.validateAsync(options);

  const { device, logger } = ctx;
  const { challengeId, certificateVerifier, strategy } = options;

  await assertChallenge(ctx)({ challengeId, certificateVerifier, strategy });

  logger.debug("certificate challenge verified", {
    accountId: device.accountId,
    deviceId: device.id,
  });
};
