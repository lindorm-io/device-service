import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../../typing";
import { Scope } from "@lindorm-io/jwt";

interface IRemoveDeviceOptions {
  deviceId: string;
}

const schema = Joi.object({
  deviceId: Joi.string().guid().required(),
});

export const removeDevice = (ctx: IKoaDeviceContext) => async (options: IRemoveDeviceOptions): Promise<void> => {
  await schema.validateAsync(options);

  const { logger } = ctx;
  const { authTokenHandler } = ctx.handler;
  const { deviceRepository } = ctx.repository;
  const { deviceId } = options;

  const device = await deviceRepository.find({ id: deviceId });

  authTokenHandler.assertAccountPermission(device.accountId);
  authTokenHandler.assertScope([Scope.EDIT]);

  await deviceRepository.remove(device);

  logger.debug("device removed", {
    accountId: device.accountId,
    deviceId: device.id,
  });
};
