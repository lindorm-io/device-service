import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../../typing";
import { Scope } from "@lindorm-io/jwt";
import { assertAccountPermission, assertScope } from "../../support";

export interface IRemoveDeviceOptions {
  deviceId: string;
}

const schema = Joi.object({
  deviceId: Joi.string().guid().required(),
});

export const removeDevice = (ctx: IKoaDeviceContext) => async (options: IRemoveDeviceOptions): Promise<void> => {
  await schema.validateAsync(options);

  const { logger, repository } = ctx;
  const { deviceId } = options;

  const device = await repository.device.find({ id: deviceId });

  await assertAccountPermission(ctx)(device.accountId);
  assertScope(ctx)([Scope.EDIT]);

  await repository.device.remove(device);

  logger.debug("device removed", {
    accountId: device.accountId,
    deviceId: device.id,
  });
};
