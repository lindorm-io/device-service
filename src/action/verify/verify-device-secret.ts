import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../../typing";
import { assertAccountPermission, assertDeviceChallenge, assertDeviceSecret } from "../../support";

export interface IVerifyDeviceSecretOptions {
  challenge: string;
  secret: string;
  verifier: string;
}

const schema = Joi.object({
  challenge: Joi.string().required(),
  secret: Joi.string().required(),
  verifier: Joi.string().required(),
});

export const verifyDeviceSecret = (ctx: IKoaDeviceContext) => async (
  options: IVerifyDeviceSecretOptions,
): Promise<void> => {
  await schema.validateAsync(options);

  const { device, logger } = ctx;
  const { challenge, secret, verifier } = options;

  await assertAccountPermission(ctx)(device.accountId);
  await assertDeviceChallenge(ctx)(challenge, verifier);
  await assertDeviceSecret(device, secret);

  logger.debug("device secret verified", {
    accountId: device.accountId,
    deviceId: device.id,
  });
};
