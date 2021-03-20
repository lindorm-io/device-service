import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../../typing";
import { assertDeviceChallenge, assertDeviceSecret } from "../../support";

export interface IVerifyDeviceSecretOptions {
  deviceChallenge: string;
  secret: string;
  deviceVerifier: string;
}

const schema = Joi.object({
  deviceChallenge: Joi.string().required(),
  secret: Joi.string().required(),
  deviceVerifier: Joi.string().required(),
});

export const verifyDeviceSecret = (ctx: IKoaDeviceContext) => async (
  options: IVerifyDeviceSecretOptions,
): Promise<void> => {
  await schema.validateAsync(options);

  const { device, logger } = ctx;
  const { deviceChallenge, deviceVerifier, secret } = options;

  await assertDeviceChallenge(ctx)(deviceChallenge, deviceVerifier);
  await assertDeviceSecret(device, secret);

  logger.debug("device secret verified", {
    accountId: device.accountId,
    deviceId: device.id,
  });
};
