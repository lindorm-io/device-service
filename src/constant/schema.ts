import Joi from "joi";
import { ChallengeStrategy } from "../enum";

export const JOI_BIOMETRY = Joi.string().base64().length(128);

export const JOI_CERTIFICATE_CHALLENGE = Joi.string().base64().length(64);

export const JOI_GUID = Joi.string().guid({ version: "uuidv4" });

export const JOI_JWT = Joi.string().pattern(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]+$/);

export const JOI_PINCODE = Joi.string()
  .length(6)
  .pattern(/[0-9]+/);

export const JOI_RECOVERY_KEY = Joi.string().length(35);

export const JOI_SIGNATURE = Joi.string().base64();

export const JOI_STRATEGY = Joi.string().valid(
  ChallengeStrategy.IMPLICIT,
  ChallengeStrategy.PINCODE,
  ChallengeStrategy.RECOVERY,
  ChallengeStrategy.BIOMETRY,
);
