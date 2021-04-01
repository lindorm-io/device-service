import Joi from "@hapi/joi";
import { IInitialiseChallengeData, IInitialiseChallengeOptions, IKoaDeviceContext } from "../../typing";
import { JOI_STRATEGY } from "../../constant";
import { createChallenge } from "../../support";

const schema = Joi.object({
  scope: Joi.string().required(),
  strategy: JOI_STRATEGY,
});

export const initialiseChallenge = (ctx: IKoaDeviceContext) => async (
  options: IInitialiseChallengeOptions,
): Promise<IInitialiseChallengeData> => {
  await schema.validateAsync(options);

  const { device, logger } = ctx;
  const { scope, strategy } = options;

  const challenge = await createChallenge(ctx)({ scope, strategy });

  logger.debug("certificate challenge initialised", {
    deviceId: device.id,
  });

  return {
    challengeId: challenge.id,
    certificateChallenge: challenge.certificateChallenge,
    expires: challenge.expires,
  };
};
