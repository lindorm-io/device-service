import Joi from "joi";
import { JOI_BIOMETRY, JOI_GUID, JOI_JWT, JOI_PINCODE, JOI_RECOVERY_KEY, JOI_STRATEGY } from "../constant";
import { ChallengeStrategy } from "../enum";

export const challengeInitialiseSchema = Joi.object({
  accountId: JOI_GUID.required(),
  deviceId: JOI_GUID.required(),
  payload: Joi.object().required(),
  scope: Joi.string().required(),
});

export const challengeVerifySchema = Joi.object({
  biometry: Joi.when("strategy", {
    is: ChallengeStrategy.BIOMETRY,
    then: JOI_BIOMETRY.required(),
    otherwise: Joi.forbidden(),
  }),
  certificateVerifier: Joi.string().base64().required(),
  challengeSessionToken: JOI_JWT.required(),
  pincode: Joi.when("strategy", {
    is: ChallengeStrategy.PINCODE,
    then: JOI_PINCODE.required(),
    otherwise: Joi.forbidden(),
  }),
  recoveryKey: Joi.when("strategy", {
    is: ChallengeStrategy.RECOVERY,
    then: JOI_RECOVERY_KEY.required(),
    otherwise: Joi.forbidden(),
  }),
  strategy: JOI_STRATEGY.required(),
});
