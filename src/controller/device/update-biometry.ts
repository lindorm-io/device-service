import Joi from "joi";
import { Context } from "../../typing";
import { Controller, ControllerResponse } from "@lindorm-io/koa";
import { JOI_BIOMETRY, JOI_GUID, JOI_JWT } from "../../constant";
import { cryptoLayered } from "../../instance";

interface RequestData {
  id: string;
  challengeConfirmationToken: string;
  biometry: string;
}

export const deviceUpdateBiometrySchema = Joi.object<RequestData>({
  id: JOI_GUID.required(),
  challengeConfirmationToken: JOI_JWT.required(),
  biometry: JOI_BIOMETRY.required(),
});

export const deviceUpdateBiometryController: Controller<Context<RequestData>> = async (
  ctx,
): ControllerResponse => {
  const {
    data: { biometry },
    entity: { device },
    metadata: {
      agent: { os },
      device: { name },
    },
    repository: { deviceRepository },
  } = ctx;

  device.biometry = await cryptoLayered.encrypt(biometry);

  if (name && name !== device.name) {
    device.name = name;
  }

  if (os && os !== device.os) {
    device.os = os;
  }

  await deviceRepository.update(device);

  return {
    data: {},
  };
};
