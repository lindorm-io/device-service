import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../../typing";
import { assertDeviceChallenge, assertDevicePIN } from "../../support";

export interface IVerifyDevicePINOptions {
  deviceChallenge: string;
  deviceVerifier: string;
  pin: string;
}

const schema = Joi.object({
  deviceChallenge: Joi.string().required(),
  deviceVerifier: Joi.string().required(),
  pin: Joi.string().length(6).required(),
});

export const verifyDevicePIN = (ctx: IKoaDeviceContext) => async (options: IVerifyDevicePINOptions): Promise<void> => {
  await schema.validateAsync(options);

  const { device, logger } = ctx;
  const { deviceChallenge, deviceVerifier, pin } = options;

  await assertDeviceChallenge(ctx)(deviceChallenge, deviceVerifier);
  await assertDevicePIN(device, pin);

  logger.debug("device pin verified", {
    accountId: device.accountId,
    deviceId: device.id,
  });
};
