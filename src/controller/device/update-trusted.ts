import Joi from "joi";
import { Context } from "../../typing";
import { Controller, ControllerResponse } from "@lindorm-io/koa";
import { JOI_GUID, JOI_JWT } from "../../constant";

interface RequestData {
  id: string;
  challengeConfirmationToken: string;
}

export const deviceUpdateTrustedSchema = Joi.object<RequestData>({
  id: JOI_GUID.required(),
  challengeConfirmationToken: JOI_JWT.required(),
});

export const deviceUpdateTrustedController: Controller<Context<RequestData>> = async (
  ctx,
): ControllerResponse => {
  const {
    entity: { device },
    metadata: {
      agent: { os },
      device: { name },
    },
    repository: { deviceRepository },
  } = ctx;

  device.trusted = true;

  if (name && name !== device.name) {
    device.name = name;
  }

  if (os && os !== device.os) {
    device.os = os;
  }

  await deviceRepository.update(device);

  return {
    body: {},
  };
};
