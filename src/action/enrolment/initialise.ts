import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../../typing";
import { createEnrolment } from "../../support";

interface IInitialiseEnrolmentOptions {
  macAddress: string;
  name: string;
  publicKey: string;
  uniqueId: string;
}

interface IInitialiseEnrolmentData {
  certificateChallenge: string;
  enrolmentId: string;
  expires: Date;
}

const schema = Joi.object({
  macAddress: Joi.string().required(),
  name: Joi.string().required(),
  publicKey: Joi.string().required(),
  uniqueId: Joi.string().required(),
});

export const initialiseEnrolment = (ctx: IKoaDeviceContext) => async (
  options: IInitialiseEnrolmentOptions,
): Promise<IInitialiseEnrolmentData> => {
  await schema.validateAsync(options);

  const { logger, token } = ctx;
  const { macAddress, name, publicKey, uniqueId } = options;
  const {
    bearer: { subject: accountId },
  } = token;

  const enrolment = await createEnrolment(ctx)({ accountId, macAddress, name, publicKey, uniqueId });

  logger.debug("enrolment initialised", {
    enrolmentId: enrolment.id,
  });

  return {
    certificateChallenge: enrolment.certificateChallenge,
    enrolmentId: enrolment.id,
    expires: enrolment.expires,
  };
};
