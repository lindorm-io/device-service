import Joi from "joi";
import { CertificateMethod, ChallengeStrategy } from "../enum";

export const JOI_BIOMETRY = Joi.string().base64().length(128);

export const JOI_CERTIFICATE_CHALLENGE = Joi.string().base64().length(128);

export const JOI_CERTIFICATE_METHOD = Joi.string().valid(
  CertificateMethod.SHA256,
  CertificateMethod.SHA384,
  CertificateMethod.SHA512,
);

export const JOI_GUID = Joi.string().guid({ version: "uuidv4" });

export const JOI_JWT = Joi.string().pattern(
  /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]+$/,
);

export const JOI_PINCODE = Joi.string()
  .length(6)
  .pattern(/[0-9]+/);

export const JOI_SIGNATURE = Joi.string().base64();

export const JOI_STRATEGY = Joi.string().valid(
  ChallengeStrategy.IMPLICIT,
  ChallengeStrategy.PINCODE,
  ChallengeStrategy.BIOMETRY,
);
