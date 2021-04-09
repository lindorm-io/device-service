import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../../typing";
import {
  assertEnrolment,
  createDeviceFromEnrolment,
  createDeviceRecoveryKeys,
  removeEnrolledDevice,
} from "../../support";

interface IConcludeEnrolmentOptions {
  certificateVerifier: string;
  enrolmentId: string;
  pin: string;
  secret?: string;
}

interface IConcludeEnrolmentData {
  deviceId: string;
  recoveryKeys: Array<string>;
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

  const { cache, logger } = ctx;
  const { certificateVerifier, enrolmentId, pin, secret } = options;

  const enrolment = await assertEnrolment(ctx)({
    certificateVerifier,
    enrolmentId,
  });

  const { recoveryKeys, signatures } = await createDeviceRecoveryKeys(3);

  await removeEnrolledDevice(ctx)(enrolment);
  const device = await createDeviceFromEnrolment(ctx)({
    enrolment,
    pin,
    recoveryKeys: signatures,
    secret,
  });

  logger.debug("enrolment verified", {
    deviceId: device.id,
  });

  await cache.enrolment.remove(enrolment);

  return { deviceId: device.id, recoveryKeys };
};
