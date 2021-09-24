import Joi from "joi";
import { Context } from "../../typing";
import { Controller, ControllerResponse } from "@lindorm-io/koa";
import { JOI_GUID } from "../../constant";

interface RequestData {
  id: string;
}

export const deviceRemoveSchema = Joi.object<RequestData>({
  id: JOI_GUID.required(),
});

export const deviceRemoveController: Controller<Context<RequestData>> = async (
  ctx,
): ControllerResponse => {
  const {
    entity: { device },
    repository: { deviceRepository },
  } = ctx;

  await deviceRepository.destroy(device);

  return {
    body: {},
  };
};
