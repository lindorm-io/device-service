import Joi from "joi";
import { Context } from "../../typing";
import { Controller, ControllerResponse } from "@lindorm-io/koa";
import { JOI_GUID, JOI_JWT, JOI_PINCODE } from "../../constant";
import { cryptoLayered } from "../../instance";

interface RequestData {
  id: string;
  challengeConfirmationToken: string;
  pincode: string;
}

export const deviceUpdatePincodeSchema = Joi.object<RequestData>({
  id: JOI_GUID.required(),
  challengeConfirmationToken: JOI_JWT.required(),
  pincode: JOI_PINCODE.required(),
});

export const deviceUpdatePincodeController: Controller<Context<RequestData>> = async (
  ctx,
): ControllerResponse => {
  const {
    data: { pincode },
    entity: { device },
    metadata: {
      agent: { os },
      device: { name },
    },
    repository: { deviceRepository },
  } = ctx;

  device.pincode = await cryptoLayered.encrypt(pincode);

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
