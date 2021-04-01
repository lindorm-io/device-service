import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../../typing";
import { Scope } from "@lindorm-io/jwt";
import { assertScope, encryptDevicePIN } from "../../support";

interface IUpdateDevicePinOptions {
  pin: string;
}

const schema = Joi.object({
  pin: Joi.string().length(6).required(),
});

export const updateDevicePIN = (ctx: IKoaDeviceContext) => async (options: IUpdateDevicePinOptions): Promise<void> => {
  await schema.validateAsync(options);

  const { logger, repository, token } = ctx;
  const { pin } = options;
  const {
    challengeConfirmation: { deviceId },
  } = token;

  const device = await repository.device.find({ id: deviceId });

  assertScope(ctx)([Scope.EDIT]);

  device.pin = {
    signature: await encryptDevicePIN(pin),
    updated: new Date(),
  };

  await repository.device.update(device);

  logger.debug("device pin updated", {
    accountId: device.accountId,
    deviceId: device.id,
  });
};
