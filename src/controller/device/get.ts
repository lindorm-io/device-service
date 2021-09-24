import Joi from "joi";
import { Context } from "../../typing";
import { Controller, ControllerResponse } from "@lindorm-io/koa";
import { DeviceAttributes } from "../../entity";
import { JOI_GUID } from "../../constant";

interface RequestData {
  id: string;
}

export const deviceGetSchema = Joi.object<RequestData>({
  id: JOI_GUID.required(),
});

export const deviceGetController: Controller<Context<RequestData>> = async (
  ctx,
): ControllerResponse<Partial<DeviceAttributes>> => {
  const {
    entity: { device },
  } = ctx;

  const {
    id,
    active,
    identityId,
    installationId,
    macAddress,
    name,
    os,
    platform,
    trusted,
    uniqueId,
  } = device;

  return {
    body: {
      id,
      active,
      identityId,
      installationId,
      macAddress,
      name,
      os,
      platform,
      trusted,
      uniqueId,
    },
  };
};
