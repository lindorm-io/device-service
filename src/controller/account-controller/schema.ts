import Joi from "joi";

export const schemaGetDevices = Joi.object({
  accountId: Joi.string().guid(),
});
