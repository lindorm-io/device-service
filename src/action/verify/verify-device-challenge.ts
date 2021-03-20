import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../../typing";
import { assertDeviceChallenge } from "../../support";

export interface IVerifyDeviceChallengeOptions {
  deviceChallenge: string;
  deviceVerifier: string;
}

const schema = Joi.object({
  deviceChallenge: Joi.string().required(),
  deviceVerifier: Joi.string().required(),
});

export const verifyDeviceChallenge = (ctx: IKoaDeviceContext) => async (
  options: IVerifyDeviceChallengeOptions,
): Promise<void> => {
  await schema.validateAsync(options);

  const { device, logger } = ctx;
  const { deviceChallenge, deviceVerifier } = options;

  await assertDeviceChallenge(ctx)(deviceChallenge, deviceVerifier);

  logger.debug("device challenge verified", {
    accountId: device.accountId,
    deviceId: device.id,
  });
};
