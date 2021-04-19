import { KoaDeviceContextAware } from "../../class";
import { IDeviceData, IGetDevicesData, IGetDevicesOptions } from "../../typing";
import { schemaGetDevices } from "./schema";

export class AccountController extends KoaDeviceContextAware {
  public async getDevices(options: IGetDevicesOptions): Promise<IGetDevicesData> {
    const {
      handler: { authTokenHandler },
      logger,
      repository: { deviceRepository },
    } = this.ctx;

    await schemaGetDevices.validateAsync(options);
    const { accountId } = options;

    authTokenHandler.assertPermission(accountId);

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
  }
}
