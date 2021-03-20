import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../../typing";
import { Scope } from "@lindorm-io/jwt";
import { assertAccountPermission, assertDevicePIN, assertScope, encryptDevicePIN } from "../../support";

export interface IUpdateDevicePinOptions {
  deviceId: string;
  pin: string;
  updatedPin: string;
}

const schema = Joi.object({
  deviceId: Joi.string().guid().required(),
  pin: Joi.string().length(6).required(),
  updatedPin: Joi.string().length(6).required(),
});

export const updateDevicePIN = (ctx: IKoaDeviceContext) => async (options: IUpdateDevicePinOptions): Promise<void> => {
  await schema.validateAsync(options);

  const { logger, repository } = ctx;
  const { deviceId, pin, updatedPin } = options;

  const device = await repository.device.find({ id: deviceId });

  await assertAccountPermission(ctx)(device.accountId);
  await assertDevicePIN(device, pin);
  assertScope(ctx)([Scope.EDIT]);

  device.pin = {
    signature: await encryptDevicePIN(updatedPin),
    updated: new Date(),
  };

  await repository.device.update(device);

  logger.debug("device pin updated", {
    accountId: device.accountId,
    deviceId: device.id,
  });
};
