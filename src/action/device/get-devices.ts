import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../../typing";

interface IGetDevicesOptions {
  accountId: string;
}

interface IDeviceData {
  deviceId: string;
  macAddress: string;
  name: string;
  uniqueId: string;
}

interface IGetDevicesData {
  devices: Array<IDeviceData>;
}

const schema = Joi.object({
  accountId: Joi.string().guid(),
});

export const getDevices = (ctx: IKoaDeviceContext) => async (options: IGetDevicesOptions): Promise<IGetDevicesData> => {
  await schema.validateAsync(options);

  const { logger } = ctx;
  const { authTokenHandler } = ctx.handler;
  const { deviceRepository } = ctx.repository;
  const { accountId } = options;

  authTokenHandler.assertAccountPermission(accountId);

  const array = await deviceRepository.findMany({ accountId });
  const devices: Array<IDeviceData> = [];

  for (const device of array) {
    devices.push({
      deviceId: device.id,
      macAddress: device.macAddress,
      name: device.name,
      uniqueId: device.uniqueId,
    });
  }

  logger.debug("devices found", { devices });

  return { devices };
};
