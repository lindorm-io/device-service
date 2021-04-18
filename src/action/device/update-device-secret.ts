import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../../typing";
import { Scope } from "@lindorm-io/jwt";

interface IChangeDeviceSecretOptions {
  secret: string;
}

const schema = Joi.object({
  secret: Joi.string().required(),
});

export const updateDeviceSecret = (ctx: IKoaDeviceContext) => async (
  options: IChangeDeviceSecretOptions,
): Promise<void> => {
  await schema.validateAsync(options);

  const { logger } = ctx;
  const { authTokenHandler, deviceHandler } = ctx.handler;
  const { deviceRepository } = ctx.repository;
  const { deviceId } = ctx.token.challengeConfirmation;
  const { secret } = options;

  const device = await deviceRepository.find({ id: deviceId });

  authTokenHandler.assertScope([Scope.EDIT]);

  device.secret = {
    signature: await deviceHandler.encryptDeviceSecret(secret),
    updated: new Date(),
  };

  await deviceRepository.update(device);

  logger.debug("device secret updated", {
    accountId: device.accountId,
    deviceId: device.id,
  });
};
