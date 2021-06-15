import Joi from "joi";
import { Controller, ControllerResponse, HttpStatus } from "@lindorm-io/koa";
import { DeviceContext } from "../../typing";
import { JOI_GUID } from "../../constant";
import { assertBearerToDevice } from "../../util";

interface RequestBody {
  deviceId: string;
}

export const deviceRemoveSchema = Joi.object({
  deviceId: JOI_GUID.required(),
});

export const deviceRemove: Controller<DeviceContext<RequestBody>> = async (
  ctx,
): Promise<ControllerResponse<Record<string, never>>> => {
  const {
    entity: { device },
    logger,
    repository: { deviceRepository },
    token: { bearerToken },
  } = ctx;

  logger.debug("device removal requested", {
    id: device.id,
    accountId: device.accountId,
  });

  assertBearerToDevice(bearerToken, device);

  await deviceRepository.remove(device);

  logger.info("device removal successful");

  return {
    body: {},
    status: HttpStatus.Success.ACCEPTED,
  };
};
