import Joi from "joi";
import { Context } from "../../typing";
import { Controller, ControllerResponse } from "@lindorm-io/koa";
import { JOI_GUID, JOI_JWT } from "../../constant";

interface RequestData {
  id: string;
  enrolmentSessionToken: string;
}

export const enrolmentRejectSchema = Joi.object<RequestData>({
  id: JOI_GUID.required(),
  enrolmentSessionToken: JOI_JWT.required(),
});

export const enrolmentRejectController: Controller<Context<RequestData>> = async (
  ctx,
): ControllerResponse => {
  const {
    cache: { enrolmentSessionCache },
    entity: { enrolmentSession },
  } = ctx;

  await enrolmentSessionCache.destroy(enrolmentSession);

  return {
    body: {},
  };
};
