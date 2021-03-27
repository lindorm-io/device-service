import Joi from "@hapi/joi";
import { JOI_CERTIFICATE_CHALLENGE, JOI_EVENTS, JOI_STRATEGY } from "../../constant";

export const schema = Joi.object({
  id: Joi.string().guid().required(),
  version: Joi.number().required(),
  created: Joi.date().required(),
  updated: Joi.date().required(),
  events: JOI_EVENTS,

  certificateChallenge: JOI_CERTIFICATE_CHALLENGE,
  deviceId: Joi.string().guid().required(),
  expires: Joi.date().required(),
  strategy: JOI_STRATEGY,
});
