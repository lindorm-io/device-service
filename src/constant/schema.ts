import Joi from "joi";
import { ChallengeStrategy } from "../enum";

export const JOI_STRATEGY = Joi.string()
  .valid(ChallengeStrategy.IMPLICIT, ChallengeStrategy.PIN, ChallengeStrategy.RECOVERY, ChallengeStrategy.SECRET)
  .required();

export const JOI_SIGNATURE = Joi.object({
  signature: Joi.string().base64().allow(null).required(),
  updated: Joi.date().allow(null).required(),
});

export const JOI_CERTIFICATE_CHALLENGE = Joi.string().base64().length(64).required();
