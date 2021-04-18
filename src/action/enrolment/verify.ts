import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../../typing";

interface IConcludeEnrolmentOptions {
  certificateVerifier: string;
  enrolmentId: string;
  pin: string;
  secret?: string;
}

interface IConcludeEnrolmentData {
  deviceId: string;
  recoveryKey: string;
}

const schema = Joi.object({
  certificateVerifier: Joi.string().required(),
  enrolmentId: Joi.string().guid().required(),
  pin: Joi.string().length(6).required(),
  secret: Joi.string(),
});

export const verifyEnrolment = (ctx: IKoaDeviceContext) => async (
  options: IConcludeEnrolmentOptions,
): Promise<IConcludeEnrolmentData> => {
  await schema.validateAsync(options);

  const { logger } = ctx;
  const { enrolmentCache } = ctx.cache;
  const { enrolmentHandler, deviceHandler } = ctx.handler;
  const { certificateVerifier, enrolmentId, pin, secret } = options;

  const enrolment = await enrolmentHandler.assertEnrolment(enrolmentId, certificateVerifier);
  await enrolmentHandler.removeEnrolledDevice(enrolment);

  const recoveryKey = await deviceHandler.createDeviceRecoveryKey();

  const device = await enrolmentHandler.createDeviceFromEnrolment({
    enrolment,
    pin,
    recoveryKey,
    secret,
  });

  logger.debug("enrolment verified", {
    deviceId: device.id,
  });

  await enrolmentCache.remove(enrolment);

  return { deviceId: device.id, recoveryKey };
};
