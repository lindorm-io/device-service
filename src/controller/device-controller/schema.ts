import Joi from "joi";

export const schemaUpdateName = Joi.object({
  deviceId: Joi.string().guid().required(),
  name: Joi.string().required(),
});

export const schemaUpdatePin = Joi.object({
  deviceId: Joi.string().guid().required(),
  pin: Joi.string().length(6).required(),
});

export const schemaUpdateSecret = Joi.object({
  deviceId: Joi.string().guid().required(),
  secret: Joi.string().required(),
});

export const schemaRemove = Joi.object({
  deviceId: Joi.string().guid().required(),
});
