import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../../typing";
import { assertEnrolment, createDeviceFromEnrolment } from "../../support";

interface IConcludeEnrolmentOptions {
  certificateVerifier: string;
  enrolmentId: string;
  pin: string;
  secret?: string;
}

interface IConcludeEnrolmentData {
  deviceId: string;
}

const schema = Joi.object({
  certificateVerifier: Joi.string().required(),
  enrolmentId: Joi.string().guid().required(),
  pin: Joi.string().length(6).required(),
  secret: Joi.string(),
});

export const concludeEnrolment = (ctx: IKoaDeviceContext) => async (
  options: IConcludeEnrolmentOptions,
): Promise<IConcludeEnrolmentData> => {
  await schema.validateAsync(options);

  const { cache, logger } = ctx;
  const { certificateVerifier, enrolmentId, pin, secret } = options;

  const enrolment = await assertEnrolment(ctx)({
    certificateVerifier,
    enrolmentId,
  });
  const device = await createDeviceFromEnrolment(ctx)({
    enrolment,
    pin,
    secret,
  });

  logger.debug("enrolment concluded", {
    deviceId: device.id,
  });

  await cache.enrolment.remove(enrolment);

  return { deviceId: device.id };
};
