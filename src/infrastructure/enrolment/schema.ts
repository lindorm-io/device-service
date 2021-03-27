import Joi from "@hapi/joi";
import { JOI_CERTIFICATE_CHALLENGE, JOI_EVENTS } from "../../constant";

export const schema = Joi.object({
  id: Joi.string().guid().required(),
  version: Joi.number().required(),
  created: Joi.date().required(),
  updated: Joi.date().required(),
  events: JOI_EVENTS,

  accountId: Joi.string().guid().required(),
  certificateChallenge: JOI_CERTIFICATE_CHALLENGE,
  expires: Joi.date().required(),
  macAddress: Joi.string().required(),
  name: Joi.string().required(),
  publicKey: Joi.string().required(),
  uniqueId: Joi.string().required(),
});
