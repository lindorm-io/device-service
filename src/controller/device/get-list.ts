import { Context } from "../../typing";
import { Controller, ControllerResponse } from "@lindorm-io/koa";
import { DeviceAttributes } from "../../entity";

interface ResponseData {
  devices: Array<Partial<DeviceAttributes>>;
}

export const deviceGetListController: Controller<Context> = async (
  ctx,
): ControllerResponse<ResponseData> => {
  const {
    repository: { deviceRepository },
    token: {
      bearerToken: { subject: identityId },
    },
  } = ctx;

  const list = await deviceRepository.findMany({ identityId });
  const devices: Array<Partial<DeviceAttributes>> = [];

  for (const device of list) {
    devices.push({
      id: device.id,
      active: device.active,
      name: device.name,
      platform: device.platform,
      trusted: device.trusted,
    });
  }

  return {
    body: { devices },
  };
};
