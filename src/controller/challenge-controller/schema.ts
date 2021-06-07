import Joi from "joi";
import { JOI_STRATEGY } from "../../constant";

export const schemaInitialise = Joi.object({
  scope: Joi.string().required(),
  strategy: JOI_STRATEGY,
});

export const schemaVerifyImplicit = Joi.object({
  certificateVerifier: Joi.string().required(),
  strategy: JOI_STRATEGY,
});

export const schemaVerifyPin = Joi.object({
  certificateVerifier: Joi.string().required(),
  pin: Joi.string().length(6).required(),
  strategy: JOI_STRATEGY,
});

export const schemaVerifyRecoveryKey = Joi.object({
  certificateVerifier: Joi.string().required(),
  recoveryKey: Joi.string().required(),
  strategy: JOI_STRATEGY,
});

export const schemaVerifySecret = Joi.object({
  certificateVerifier: Joi.string().required(),
  secret: Joi.string().required(),
  strategy: JOI_STRATEGY,
});
