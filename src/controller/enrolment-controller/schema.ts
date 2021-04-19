import Joi from "@hapi/joi";

export const schemaInitialise = Joi.object({
  macAddress: Joi.string().required(),
  name: Joi.string().required(),
  publicKey: Joi.string().required(),
  uniqueId: Joi.string().required(),
});

export const schemaVerify = Joi.object({
  certificateVerifier: Joi.string().required(),
  enrolmentId: Joi.string().guid().required(),
  pin: Joi.string().length(6).required(),
  secret: Joi.string(),
});
