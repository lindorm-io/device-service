import Joi from "joi";
import { JOI_BIOMETRY, JOI_JWT, JOI_PINCODE } from "../constant";

export const enrolmentInitialiseSchema = Joi.object({
  macAddress: Joi.string().required(),
  name: Joi.string().required(),
  publicKey: Joi.string().required(),
  uniqueId: Joi.string().required(),
});

export const enrolmentVerifySchema = Joi.object({
  biometry: JOI_BIOMETRY,
  certificateVerifier: Joi.string().base64().required(),
  enrolmentSessionToken: JOI_JWT.required(),
  pincode: JOI_PINCODE.required(),
});
