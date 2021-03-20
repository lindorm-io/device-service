import Joi from "@hapi/joi";
import { Device } from "../../entity";
import { IKoaDeviceContext } from "../../typing";
import { Scope } from "@lindorm-io/jwt";
import { assertAccountPermission, assertScope, encryptDevicePIN, encryptDeviceSecret } from "../../support";

export interface ICreateDeviceOptions {
  macAddress: string;
  name: string;
  pin: string;
  publicKey: string;
  secret: string;
  uniqueId: string;
}

export interface ICreateDeviceData {
  deviceId: string;
}

const schema = Joi.object({
  macAddress: Joi.string(),
  name: Joi.string(),
  pin: Joi.string().length(6).required(),
  publicKey: Joi.string().required(),
  secret: Joi.string(),
  uniqueId: Joi.string(),
});

export const createDevice = (ctx: IKoaDeviceContext) => async (
  options: ICreateDeviceOptions,
): Promise<ICreateDeviceData> => {
  await schema.validateAsync(options);

  const { logger, repository, token } = ctx;
  const { macAddress, name, pin, publicKey, secret, uniqueId } = options;
  const {
    bearer: { subject },
  } = token;

  await assertAccountPermission(ctx)(subject);
  assertScope(ctx)([Scope.EDIT]);

  const device = new Device({
    accountId: subject,
    macAddress,
    name,
    pin: { signature: await encryptDevicePIN(pin), updated: new Date() },
    publicKey,
    secret: secret && { signature: await encryptDeviceSecret(secret), updated: new Date() },
    uniqueId,
  });

  await repository.device.create(device);

  logger.debug("device created", {
    accountId: subject,
    macAddress,
    name,
    pin,
    publicKey,
    secret,
    uniqueId,
  });

  return { deviceId: device.id };
};
