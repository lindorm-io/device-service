import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../../typing";
import { Scope } from "@lindorm-io/jwt";
import { assertScope, encryptDeviceSecret } from "../../support";

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

  const { logger, repository, token } = ctx;
  const { secret } = options;
  const {
    challengeConfirmation: { deviceId },
  } = token;

  const device = await repository.device.find({ id: deviceId });

  assertScope(ctx)([Scope.EDIT]);

  device.secret = {
    signature: await encryptDeviceSecret(secret),
    updated: new Date(),
  };

  await repository.device.update(device);

  logger.debug("device secret updated", {
    accountId: device.accountId,
    deviceId: device.id,
  });
};
