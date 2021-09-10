import Joi from "joi";
import { CertificateMethod, TokenType } from "../../enum";
import { Context } from "../../typing";
import { Controller, ControllerResponse } from "@lindorm-io/koa";
import { EnrolmentSession } from "../../entity";
import { JOI_CERTIFICATE_METHOD } from "../../constant";
import { config } from "../../config";
import { getRandomValue, stringToSeconds } from "@lindorm-io/core";

interface RequestData {
  certificateMethod: CertificateMethod;
  macAddress: string;
  publicKey: string;
}

interface ResponseData {
  certificateChallenge: string;
  enrolmentSessionToken: string;
  expiresIn: number;
}

export const enrolmentInitialiseSchema = Joi.object<RequestData>({
  certificateMethod: JOI_CERTIFICATE_METHOD.required(),
  macAddress: Joi.string().required(),
  publicKey: Joi.string().required(),
});

export const enrolmentInitialiseController: Controller<Context<RequestData>> = async (
  ctx,
): ControllerResponse<ResponseData> => {
  const {
    cache: { enrolmentSessionCache },
    data: { certificateMethod, macAddress, publicKey },
    jwt,
    metadata: {
      agent: { os, platform },
      client: { id: clientId },
      device: { installationId, name, uniqueId },
    },
    token: {
      bearerToken: { subject: identityId },
    },
  } = ctx;

  const certificateChallenge = getRandomValue(128);
  const expiresIn = stringToSeconds(config.EXPIRY_CHALLENGE_SESSION);

  const session = await enrolmentSessionCache.create(
    new EnrolmentSession({
      certificateChallenge,
      certificateMethod,
      identityId,
      installationId,
      macAddress,
      name,
      os,
      platform,
      publicKey,
      uniqueId,
    }),
    expiresIn,
  );

  const { token } = jwt.sign({
    audiences: [clientId],
    expiry: config.EXPIRY_ENROLMENT_SESSION,
    sessionId: session.id,
    subject: identityId,
    subjectHint: "identity",
    type: TokenType.ENROLMENT_SESSION_TOKEN,
  });

  return {
    data: {
      certificateChallenge,
      enrolmentSessionToken: token,
      expiresIn,
    },
  };
};
