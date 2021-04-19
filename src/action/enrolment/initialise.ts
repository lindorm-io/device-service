import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../../typing";

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

  const { logger } = ctx;
  const { enrolmentHandler } = ctx.handler;
  const { subject: accountId } = ctx.token.bearer;
  const { macAddress, name, publicKey, uniqueId } = options;

  const enrolment = await enrolmentHandler.create({
    accountId,
    macAddress,
    name,
    publicKey,
    uniqueId,
  });

  logger.debug("enrolment initialised", {
    enrolmentId: enrolment.id,
  });

  return {
    certificateChallenge: enrolment.certificateChallenge,
    enrolmentId: enrolment.id,
    expires: enrolment.expires,
  };
};
