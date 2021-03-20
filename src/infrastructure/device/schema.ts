import Joi from "@hapi/joi";
import { JOI_EVENTS } from "../../constant";

export const schema = Joi.object({
  id: Joi.string().guid().required(),
  version: Joi.number().required(),
  created: Joi.date().required(),
  updated: Joi.date().required(),
  events: JOI_EVENTS,

  accountId: Joi.string().guid().required(),
  macAddress: Joi.string().allow(null).required(),
  name: Joi.string().allow(null).required(),
  pin: Joi.object({
    signature: Joi.string().base64().allow(null).required(),
    updated: Joi.date().allow(null).required(),
  }),
  publicKey: Joi.string().required(),
  secret: Joi.object({
    signature: Joi.string().base64().allow(null).required(),
    updated: Joi.date().allow(null).required(),
  }),
  uniqueId: Joi.string().allow(null).required(),
});
