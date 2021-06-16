import Joi from "joi";
import { Algorithm } from "@lindorm-io/key-pair";
import { Audience, ChallengeStrategy } from "../../enum";
import { ClientError } from "@lindorm-io/errors";
import { Controller, ControllerResponse, HttpStatus } from "@lindorm-io/koa";
import { CryptoError, CryptoKeyPair } from "@lindorm-io/crypto";
import { DeviceContext } from "../../typing";
import { JOI_JWT, JOI_PINCODE, JOI_RECOVERY_KEY, JOI_SECRET, JOI_STRATEGY } from "../../constant";
import { config } from "../../config";
import { cryptoLayered } from "../../crypto";
import { includes } from "lodash";

interface RequestBody {
  certificateVerifier: string;
  challengeSessionToken: string;
  pincode: string;
  recoveryKey: string;
  secret: string;
  strategy: ChallengeStrategy;
}

interface ResponseBody {
  challengeConfirmationToken: string;
  expires: number;
  expiresIn: number;
}

export const challengeVerifySchema = Joi.object({
  certificateVerifier: Joi.string().base64().required(),
  challengeSessionToken: JOI_JWT.required(),
  strategy: JOI_STRATEGY.required(),

  pincode: Joi.when("strategy", {
    is: ChallengeStrategy.PINCODE,
    then: JOI_PINCODE.required(),
    otherwise: Joi.forbidden(),
  }),
  recoveryKey: Joi.when("strategy", {
    is: ChallengeStrategy.RECOVERY,
    then: JOI_RECOVERY_KEY.required(),
    otherwise: Joi.forbidden(),
  }),
  secret: Joi.when("strategy", {
    is: ChallengeStrategy.SECRET,
    then: JOI_SECRET.required(),
    otherwise: Joi.forbidden(),
  }),
});

export const challengeVerify: Controller<DeviceContext<RequestBody>> = async (
  ctx,
): Promise<ControllerResponse<ResponseBody>> => {
  const {
    cache: { challengeSessionCache },
    entity: { challengeSession, device },
    jwt,
    logger,
    metadata: { clientId },
    request: {
      body: { certificateVerifier, pincode, recoveryKey, secret, strategy },
    },
  } = ctx;

  logger.debug("challenge session verification requested", {
    id: challengeSession.id,
    clientId,
    deviceId: device.id,
    pincode,
    recoveryKey,
    scope: challengeSession.scope,
    secret,
    strategy,
  });

  if (!includes(challengeSession.strategies, strategy)) {
    throw new ClientError("Conflicting values", {
      debug: {
        strategies: challengeSession.strategies,
        strategy,
      },
      description: "Invalid strategy",
      statusCode: ClientError.StatusCode.CONFLICT,
    });
  }

  const crypto = new CryptoKeyPair({
    algorithm: Algorithm.RS512,
    passphrase: "",
    privateKey: null,
    publicKey: device.publicKey,
  });

  try {
    await crypto.assert(challengeSession.certificateChallenge, certificateVerifier);
  } catch (err) {
    if (err instanceof CryptoError) {
      throw new ClientError("Invalid Certificate Verifier", {
        debug: {
          certificateChallenge: challengeSession.certificateChallenge,
          certificateVerifier,
        },
        statusCode: ClientError.StatusCode.CONFLICT,
      });
    }

    throw err;
  }

  switch (strategy) {
    case ChallengeStrategy.IMPLICIT:
      break;

    case ChallengeStrategy.PINCODE:
      await cryptoLayered.assert(pincode, device.pincode.signature);
      break;

    case ChallengeStrategy.RECOVERY:
      await cryptoLayered.assert(recoveryKey, device.recoveryKey.signature);
      break;

    case ChallengeStrategy.SECRET:
      await cryptoLayered.assert(secret, device.secret.signature);
      break;

    default:
      throw new ClientError("Invalid strategy", {
        debug: { strategy },
      });
  }

  const { expires, expiresIn, token } = jwt.sign({
    id: challengeSession.id,
    audience: Audience.CHALLENGE_CONFIRMATION,
    clientId,
    deviceId: device.id,
    expiry: config.CHALLENGE_CONFIRMATION_EXPIRY,
    payload: challengeSession.payload,
    scope: challengeSession.scope,
    subject: device.accountId,
  });

  await challengeSessionCache.remove(challengeSession);

  logger.info("challenge session verified");

  return {
    body: {
      challengeConfirmationToken: token,
      expires,
      expiresIn,
    },
    status: HttpStatus.Success.OK,
  };
};
