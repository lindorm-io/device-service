import Joi from "joi";
import { JOI_BIOMETRY, JOI_GUID, JOI_JWT, JOI_PINCODE } from "../constant";

export const deviceRemoveSchema = Joi.object({
  deviceId: JOI_GUID.required(),
});

export const deviceUpdateBiometrySchema = Joi.object({
  biometry: JOI_BIOMETRY.required(),
  challengeConfirmationToken: JOI_JWT.required(),
});

export const deviceUpdateNameSchema = Joi.object({
  deviceId: JOI_GUID.required(),
  name: Joi.string().required(),
});

export const deviceUpdatePincodeSchema = Joi.object({
  challengeConfirmationToken: JOI_JWT.required(),
  pincode: JOI_PINCODE.required(),
});

export const deviceUpdateRecoveryKeySchema = Joi.object({
  challengeConfirmationToken: JOI_JWT.required(),
});
