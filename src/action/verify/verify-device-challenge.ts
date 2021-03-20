import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../../typing";
import { assertAccountPermission, assertDeviceChallenge } from "../../support";

export interface IVerifyDeviceChallengeOptions {
  challenge: string;
  verifier: string;
}

const schema = Joi.object({
  challenge: Joi.string().required(),
  verifier: Joi.string().required(),
});

export const verifyDeviceChallenge = (ctx: IKoaDeviceContext) => async (
  options: IVerifyDeviceChallengeOptions,
): Promise<void> => {
  await schema.validateAsync(options);

  const { device, logger } = ctx;
  const { challenge, verifier } = options;

  await assertAccountPermission(ctx)(device.accountId);
  await assertDeviceChallenge(ctx)(challenge, verifier);

  logger.debug("device challenge verified", {
    accountId: device.accountId,
    deviceId: device.id,
  });
};
