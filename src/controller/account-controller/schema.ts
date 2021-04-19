import Joi from "@hapi/joi";

export const schemaGetDevices = Joi.object({
  accountId: Joi.string().guid(),
});
