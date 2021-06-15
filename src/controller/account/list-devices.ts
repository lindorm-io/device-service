import { ClientError } from "@lindorm-io/errors";
import { Controller, ControllerResponse, HttpStatus } from "@lindorm-io/koa";
import { DeviceContext } from "../../typing";
import { Scope } from "@lindorm-io/jwt";
import { includes } from "lodash";

interface DeviceInfo {
  id: string;
  macAddress: string;
  name: string;
  uniqueId: string;
}

interface ResponseBody {
  devices: Array<DeviceInfo>;
}

export const accountListDevices: Controller<DeviceContext> = async (ctx): Promise<ControllerResponse<ResponseBody>> => {
  const {
    logger,
    repository: { deviceRepository },
    token: { bearerToken },
  } = ctx;

  logger.debug("device list requested", {
    accountId: bearerToken.subject,
  });

  if (!includes(bearerToken.scope, Scope.DEFAULT)) {
    throw new ClientError("Forbidden", {
      debug: { bearerToken },
      description: "Invalid scope",
      statusCode: ClientError.StatusCode.FORBIDDEN,
    });
  }

  const list = await deviceRepository.findMany({ accountId: bearerToken.subject });
  const devices: Array<DeviceInfo> = [];

  for (const device of list) {
    devices.push({
      id: device.id,
      macAddress: device.macAddress,
      name: device.name,
      uniqueId: device.uniqueId,
    });
  }

  logger.info("device list resolved", {
    accountId: bearerToken.subject,
    devices,
  });

  return {
    body: { devices },
    status: HttpStatus.Success.OK,
  };
};
