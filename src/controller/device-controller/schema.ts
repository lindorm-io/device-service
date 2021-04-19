import Joi from "@hapi/joi";

export const schemaUpdateName = Joi.object({
  deviceId: Joi.string().guid().required(),
  name: Joi.string().required(),
});

export const schemaUpdatePin = Joi.object({
  pin: Joi.string().length(6).required(),
});

export const schemaUpdateSecret = Joi.object({
  secret: Joi.string().required(),
});

export const schemaRemove = Joi.object({
  deviceId: Joi.string().guid().required(),
});
