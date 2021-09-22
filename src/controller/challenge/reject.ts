import Joi from "joi";
import { Context } from "../../typing";
import { Controller, ControllerResponse } from "@lindorm-io/koa";
import { JOI_GUID, JOI_JWT } from "../../constant";

interface RequestData {
  id: string;
  challengeSessionToken: string;
}

export const challengeRejectSchema = Joi.object<RequestData>({
  id: JOI_GUID.required(),
  challengeSessionToken: JOI_JWT.required(),
});

export const challengeRejectController: Controller<Context<RequestData>> = async (
  ctx,
): ControllerResponse => {
  const {
    cache: { challengeSessionCache },
    entity: { challengeSession },
  } = ctx;

  await challengeSessionCache.destroy(challengeSession);

  return {
    data: {},
  };
};
