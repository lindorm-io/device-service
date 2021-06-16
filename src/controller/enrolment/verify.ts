import Joi from "joi";
import { Algorithm } from "@lindorm-io/key-pair";
import { Audience, ChallengeStrategy } from "../../enum";
import { ClientError } from "@lindorm-io/errors";
import { Controller, ControllerResponse, HttpStatus } from "@lindorm-io/koa";
import { CryptoError, CryptoKeyPair } from "@lindorm-io/crypto";
import { Device } from "../../entity";
import { DeviceContext } from "../../typing";
import { JOI_JWT, JOI_PINCODE, JOI_SECRET } from "../../constant";
import { config } from "../../config";
import { cryptoLayered } from "../../crypto";
import { generateRecoveryKey } from "../../util";
import { stringComparison } from "@lindorm-io/core";

interface RequestBody {
  certificateVerifier: string;
  enrolmentSessionToken: string;
  pincode: string;
  secret: string;
}

interface ResponseBody {
  challengeConfirmationToken: string;
  deviceId: string;
  expires: number;
  expiresIn: number;
  recoveryKey: string;
}

export const enrolmentVerifySchema = Joi.object({
  certificateVerifier: Joi.string().base64().required(),
  enrolmentSessionToken: JOI_JWT.required(),
  pincode: JOI_PINCODE.required(),
  secret: JOI_SECRET,
});

export const enrolmentVerify: Controller<DeviceContext<RequestBody>> = async (
  ctx,
): Promise<ControllerResponse<ResponseBody>> => {
  const {
    cache: { enrolmentSessionCache },
    entity: { enrolmentSession },
    jwt,
    logger,
    metadata: { clientId },
    repository: { deviceRepository },
    request: {
      body: { certificateVerifier, pincode, secret },
    },
    token: { bearerToken },
  } = ctx;

  logger.debug("enrolment session verification requested", {
    id: enrolmentSession.id,
    accountId: bearerToken.subject,
    clientId,
  });

  if (!stringComparison(enrolmentSession.accountId, bearerToken.subject)) {
    throw new ClientError("Conflicting values", {
      debug: {
        expect: enrolmentSession.accountId,
        actual: bearerToken.subject,
      },
      description: "Invalid account id",
      statusCode: ClientError.StatusCode.CONFLICT,
    });
  }

  const crypto = new CryptoKeyPair({
    algorithm: Algorithm.RS512,
    passphrase: "",
    privateKey: null,
    publicKey: enrolmentSession.publicKey,
  });

  try {
    await crypto.assert(enrolmentSession.certificateChallenge, certificateVerifier);
  } catch (err) {
    if (err instanceof CryptoError) {
      throw new ClientError("Invalid Certificate Verifier", {
        debug: {
          certificateChallenge: enrolmentSession.certificateChallenge,
          certificateVerifier,
        },
        statusCode: ClientError.StatusCode.CONFLICT,
      });
    }

    throw err;
  }

  const recoveryKey = generateRecoveryKey();

  const device = await deviceRepository.create(
    new Device({
      accountId: bearerToken.subject,
      macAddress: enrolmentSession.macAddress,
      name: enrolmentSession.name,
      pincode: { signature: await cryptoLayered.encrypt(pincode), updated: new Date() },
      publicKey: enrolmentSession.publicKey,
      recoveryKey: { signature: await cryptoLayered.encrypt(recoveryKey), updated: new Date() },
      secret: secret ? { signature: await cryptoLayered.encrypt(secret), updated: new Date() } : null,
      uniqueId: enrolmentSession.uniqueId,
    }),
  );

  const { id, expires, expiresIn, token } = jwt.sign({
    id: enrolmentSession.id,
    audience: Audience.CHALLENGE_CONFIRMATION,
    clientId,
    deviceId: device.id,
    expiry: config.CHALLENGE_CONFIRMATION_EXPIRY,
    scope: ["enrolment"],
    subject: bearerToken.subject,
  });

  await enrolmentSessionCache.remove(enrolmentSession);

  logger.info("enrolment session verified", {
    id,
    accountId: bearerToken.subject,
    clientId,
    deviceId: device.id,
    scope: "enrolment",
    strategy: ChallengeStrategy.IMPLICIT,
  });

  return {
    body: {
      challengeConfirmationToken: token,
      deviceId: device.id,
      expires,
      expiresIn,
      recoveryKey,
    },
    status: HttpStatus.Success.CREATED,
  };
};
