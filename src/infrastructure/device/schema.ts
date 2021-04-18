import Joi from "@hapi/joi";
import { JOI_ENCRYPTED_DATA, JOI_EVENTS } from "../../constant";

export const schema = Joi.object({
  id: Joi.string().guid().required(),
  version: Joi.number().required(),
  created: Joi.date().required(),
  updated: Joi.date().required(),
  events: JOI_EVENTS,

  accountId: Joi.string().guid().required(),
  macAddress: Joi.string().allow(null).required(),
  name: Joi.string().allow(null).required(),
  pin: JOI_ENCRYPTED_DATA,
  publicKey: Joi.string().required(),
  recoveryKey: JOI_ENCRYPTED_DATA,
  secret: JOI_ENCRYPTED_DATA,
  uniqueId: Joi.string().allow(null).required(),
});
