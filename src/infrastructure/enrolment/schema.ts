import Joi from "@hapi/joi";
import { JOI_EVENTS } from "../../constant";

export const schema = Joi.object({
  id: Joi.string().guid().required(),
  version: Joi.number().required(),
  created: Joi.date().required(),
  updated: Joi.date().required(),
  events: JOI_EVENTS,

  certificateChallenge: Joi.string().base64().length(64).required(),
  deviceId: Joi.string().guid().required(),
  expires: Joi.date().required(),
});
