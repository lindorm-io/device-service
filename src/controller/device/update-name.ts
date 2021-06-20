import { Controller, ControllerResponse, HttpStatus } from "@lindorm-io/koa";
import { DeviceContext } from "../../typing";
import { assertBearerToDevice } from "../../util";

interface RequestBody {
  deviceId: string;
  name: string;
}

export const deviceUpdateName: Controller<DeviceContext<RequestBody>> = async (
  ctx,
): Promise<ControllerResponse<Record<string, never>>> => {
  const {
    entity: { device },
    logger,
    repository: { deviceRepository },
    request: {
      body: { name },
    },
    token: { bearerToken },
  } = ctx;

  logger.debug("device name change requested", {
    id: device.id,
    accountId: device.accountId,
    name,
  });

  assertBearerToDevice(bearerToken, device);

  device.name = name;

  await deviceRepository.update(device);

  logger.info("device name change concluded");

  return {
    body: {},
    status: HttpStatus.Success.OK,
  };
};
