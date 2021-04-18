import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../../typing";
import { Scope } from "@lindorm-io/jwt";

interface IUpdateDevicePinOptions {
  pin: string;
}

const schema = Joi.object({
  pin: Joi.string().length(6).required(),
});

export const updateDevicePIN = (ctx: IKoaDeviceContext) => async (options: IUpdateDevicePinOptions): Promise<void> => {
  await schema.validateAsync(options);

  const { logger } = ctx;
  const { authTokenHandler, deviceHandler } = ctx.handler;
  const { deviceRepository } = ctx.repository;
  const { deviceId } = ctx.token.challengeConfirmation;
  const { pin } = options;

  const device = await deviceRepository.find({ id: deviceId });

  authTokenHandler.assertScope([Scope.EDIT]);

  device.pin = {
    signature: await deviceHandler.encryptDevicePIN(pin),
    updated: new Date(),
  };

  await deviceRepository.update(device);

  logger.debug("device pin updated", {
    accountId: device.accountId,
    deviceId: device.id,
  });
};
