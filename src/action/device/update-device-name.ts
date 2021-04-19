import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../../typing";
import { Scope } from "@lindorm-io/jwt";

interface IUpdateDeviceName {
  deviceId: string;
  name: string;
}

const schema = Joi.object({
  deviceId: Joi.string().guid().required(),
  name: Joi.string().required(),
});

export const updateDeviceName = (ctx: IKoaDeviceContext) => async (options: IUpdateDeviceName): Promise<void> => {
  await schema.validateAsync(options);

  const { logger } = ctx;
  const { authTokenHandler } = ctx.handler;
  const { deviceRepository } = ctx.repository;
  const { deviceId, name } = options;

  const device = await deviceRepository.find({ id: deviceId });

  authTokenHandler.assertPermission(device.accountId);
  authTokenHandler.assertScope([Scope.EDIT]);

  device.name = name;

  await deviceRepository.update(device);

  logger.debug("device updated", {
    accountId: device.accountId,
    deviceId: device.id,
  });
};
