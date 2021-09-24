import Joi from "joi";
import { ChallengeStrategy, TokenType } from "../../enum";
import { Context } from "../../typing";
import { Controller, ControllerResponse } from "@lindorm-io/koa";
import { Device } from "../../entity";
import { JOI_BIOMETRY, JOI_GUID, JOI_JWT, JOI_PINCODE } from "../../constant";
import { assertCertificateChallenge } from "../../util";
import { config } from "../../config";
import { cryptoLayered } from "../../instance";

interface RequestData {
  id: string;
  biometry: string;
  certificateVerifier: string;
  enrolmentSessionToken: string;
  pincode: string;
}

interface ResponseData {
  challengeConfirmationToken: string;
  deviceId: string;
  expiresIn: number;
}

export const enrolmentConfirmSchema = Joi.object<RequestData>({
  id: JOI_GUID.required(),
  biometry: JOI_BIOMETRY.optional(),
  certificateVerifier: Joi.string().base64().required(),
  enrolmentSessionToken: JOI_JWT.required(),
  pincode: JOI_PINCODE.optional(),
});

export const enrolmentConfirmController: Controller<Context<RequestData>> = async (
  ctx,
): ControllerResponse<ResponseData> => {
  const {
    cache: { enrolmentSessionCache },
    data: { biometry, certificateVerifier, pincode },
    entity: { enrolmentSession },
    jwt,
    metadata: {
      client: { id: clientId },
    },
    repository: { deviceRepository },
    token: {
      bearerToken: { subject: identityId },
      challengeConfirmationToken,
    },
  } = ctx;

  await assertCertificateChallenge({
    certificateChallenge: enrolmentSession.certificateChallenge,
    certificateMethod: enrolmentSession.certificateMethod,
    certificateVerifier,
    publicKey: enrolmentSession.publicKey,
  });

  const device = await deviceRepository.create(
    new Device({
      active: true,
      biometry: biometry ? await cryptoLayered.encrypt(biometry) : undefined,
      certificateMethod: enrolmentSession.certificateMethod,
      identityId,
      installationId: enrolmentSession.installationId,
      macAddress: enrolmentSession.macAddress,
      name: enrolmentSession.name,
      os: enrolmentSession.os,
      pincode: pincode ? await cryptoLayered.encrypt(pincode) : undefined,
      platform: enrolmentSession.platform,
      publicKey: enrolmentSession.publicKey,
      trusted:
        !enrolmentSession.externalChallengeRequired ||
        (enrolmentSession.externalChallengeRequired &&
          enrolmentSession.nonce === challengeConfirmationToken?.nonce),
      uniqueId: enrolmentSession.uniqueId,
    }),
  );

  const { expiresIn, token } = jwt.sign({
    audiences: [clientId],
    claims: {
      deviceId: device.id,
      strategy: ChallengeStrategy.IMPLICIT,
    },
    expiry: config.EXPIRY_CHALLENGE_CONFIRMATION_TOKEN,
    nonce: enrolmentSession.nonce,
    payload: {},
    scopes: ["enrolment"],
    sessionId: enrolmentSession.id,
    subject: device.identityId,
    subjectHint: "identity",
    type: TokenType.CHALLENGE_CONFIRMATION_TOKEN,
  });

  await enrolmentSessionCache.destroy(enrolmentSession);

  return {
    body: {
      challengeConfirmationToken: token,
      deviceId: device.id,
      expiresIn,
    },
  };
};
