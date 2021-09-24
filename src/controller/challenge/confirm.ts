import Joi from "joi";
import { ClientError } from "@lindorm-io/errors";
import { Context } from "../../typing";
import { Controller, ControllerResponse } from "@lindorm-io/koa";
import { TokenType, ChallengeStrategy } from "../../enum";
import { assertCertificateChallenge } from "../../util";
import { config } from "../../config";
import { cryptoLayered } from "../../instance";
import { updateDeviceMetadata } from "../../handler";
import {
  JOI_BIOMETRY,
  JOI_GUID,
  JOI_JWT,
  JOI_PINCODE,
  JOI_STRATEGY,
} from "../../constant";

interface RequestData {
  id: string;
  biometry: string;
  certificateVerifier: string;
  challengeSessionToken: string;
  pincode: string;
  strategy: ChallengeStrategy;
}

interface ResponseData {
  challengeConfirmationToken: string;
  expiresIn: number;
}

export const challengeConfirmSchema = Joi.object<RequestData>({
  id: JOI_GUID.required(),
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
  strategy: JOI_STRATEGY.required(),
});

export const challengeConfirmController: Controller<Context<RequestData>> = async (
  ctx,
): ControllerResponse<ResponseData> => {
  const {
    cache: { challengeSessionCache },
    data: { certificateVerifier, pincode, biometry, strategy },
    entity: { challengeSession, device },
    jwt,
    metadata: {
      client: { id: clientId },
    },
  } = ctx;

  await assertCertificateChallenge({
    certificateChallenge: challengeSession.certificateChallenge,
    certificateMethod: device.certificateMethod,
    certificateVerifier,
    publicKey: device.publicKey,
  });

  switch (strategy) {
    case ChallengeStrategy.IMPLICIT:
      break;

    case ChallengeStrategy.PINCODE:
      await cryptoLayered.assert(pincode, device.pincode);
      break;

    case ChallengeStrategy.BIOMETRY:
      await cryptoLayered.assert(biometry, device.biometry);
      break;

    default:
      throw new ClientError("Invalid strategy", {
        debug: { strategy },
      });
  }

  await updateDeviceMetadata(ctx);

  const { expiresIn, token } = jwt.sign({
    audiences: [clientId],
    claims: {
      deviceId: device.id,
      strategy,
    },
    expiry: config.EXPIRY_CHALLENGE_CONFIRMATION_TOKEN,
    nonce: challengeSession.nonce,
    payload: challengeSession.payload,
    scopes: challengeSession.scopes,
    sessionId: challengeSession.id,
    subject: device.identityId,
    subjectHint: "identity",
    type: TokenType.CHALLENGE_CONFIRMATION_TOKEN,
  });

  await challengeSessionCache.destroy(challengeSession);

  return {
    body: {
      challengeConfirmationToken: token,
      expiresIn,
    },
  };
};
