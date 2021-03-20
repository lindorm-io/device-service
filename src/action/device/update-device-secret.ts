import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../../typing";
import { Scope } from "@lindorm-io/jwt";
import { assertAccountPermission, assertDevicePIN, assertScope, encryptDeviceSecret } from "../../support";

export interface IChangeDeviceSecretOptions {
  deviceId: string;
  pin: string;
  updatedSecret: string;
}

const schema = Joi.object({
  deviceId: Joi.string().guid().required(),
  pin: Joi.string().length(6).required(),
  updatedSecret: Joi.string().required(),
});

export const updateDeviceSecret = (ctx: IKoaDeviceContext) => async (
  options: IChangeDeviceSecretOptions,
): Promise<void> => {
  await schema.validateAsync(options);

  const { logger, repository } = ctx;
  const { deviceId, pin, updatedSecret } = options;

  const device = await repository.device.find({ id: deviceId });

  await assertAccountPermission(ctx)(device.accountId);
  await assertDevicePIN(device, pin);
  assertScope(ctx)([Scope.EDIT]);

  device.secret = {
    signature: await encryptDeviceSecret(updatedSecret),
    updated: new Date(),
  };

  await repository.device.update(device);

  logger.debug("device secret updated", {
    accountId: device.accountId,
    deviceId: device.id,
  });
};
