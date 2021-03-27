import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../../typing";
import { Scope } from "@lindorm-io/jwt";
import { assertAccountPermission, assertScope } from "../../support";

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

  const { logger, repository } = ctx;
  const { deviceId, name } = options;

  const device = await repository.device.find({ id: deviceId });

  await assertAccountPermission(ctx)(device.accountId);
  assertScope(ctx)([Scope.EDIT]);

  device.name = name;

  await repository.device.update(device);

  logger.debug("device updated", {
    accountId: device.accountId,
    deviceId: device.id,
  });
};
