import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../../typing";
import { assertAccountPermission } from "../../support";

export interface IGetDevicesOptions {
  accountId: string;
}

export interface IDeviceData {
  deviceId: string;
  macAddress: string;
  name: string;
  uniqueId: string;
}

export interface IGetDevicesData {
  devices: Array<IDeviceData>;
}

const schema = Joi.object({
  accountId: Joi.string().guid(),
});

export const getDevices = (ctx: IKoaDeviceContext) => async (options: IGetDevicesOptions): Promise<IGetDevicesData> => {
  await schema.validateAsync(options);

  const { logger, repository } = ctx;
  const { accountId } = options;

  await assertAccountPermission(ctx)(accountId);

  const array = await repository.device.findMany({ accountId });
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
