import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../../typing";
import { assertAccountPermission, assertDeviceChallenge, assertDevicePIN } from "../../support";

export interface IVerifyDevicePINOptions {
  challenge: string;
  pin: string;
  verifier: string;
}

const schema = Joi.object({
  challenge: Joi.string().required(),
  pin: Joi.string().length(6).required(),
  verifier: Joi.string().required(),
});

export const verifyDevicePIN = (ctx: IKoaDeviceContext) => async (options: IVerifyDevicePINOptions): Promise<void> => {
  await schema.validateAsync(options);

  const { device, logger } = ctx;
  const { challenge, pin, verifier } = options;

  await assertAccountPermission(ctx)(device.accountId);
  await assertDeviceChallenge(ctx)(challenge, verifier);
  await assertDevicePIN(device, pin);

  logger.debug("device pin verified", {
    accountId: device.accountId,
    deviceId: device.id,
  });
};
