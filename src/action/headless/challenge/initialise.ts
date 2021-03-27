import Joi from "@hapi/joi";
import { ChallengeStrategy } from "../../../enum";
import { IKoaDeviceContext } from "../../../typing";
import { JOI_STRATEGY } from "../../../constant";
import { createChallenge } from "../../../support";

interface IInitialiseChallengeOptions {
  strategy: ChallengeStrategy;
}

interface IInitialiseChallengeData {
  challengeId: string;
  certificateChallenge: string;
  expires: Date;
}

const schema = Joi.object({
  strategy: JOI_STRATEGY,
});

export const initialiseChallenge = (ctx: IKoaDeviceContext) => async (
  options: IInitialiseChallengeOptions,
): Promise<IInitialiseChallengeData> => {
  await schema.validateAsync(options);

  const { device, logger } = ctx;
  const { strategy } = options;

  const challenge = await createChallenge(ctx)({ strategy });

  logger.debug("certificate challenge initialised", {
    deviceId: device.id,
  });

  return {
    challengeId: challenge.id,
    certificateChallenge: challenge.certificateChallenge,
    expires: challenge.expires,
  };
};
