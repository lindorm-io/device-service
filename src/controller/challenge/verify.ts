import { Algorithm } from "@lindorm-io/key-pair";
import { Audience, ChallengeStrategy } from "../../enum";
import { ClientError } from "@lindorm-io/errors";
import { Controller, ControllerResponse, HttpStatus } from "@lindorm-io/koa";
import { CryptoError, CryptoKeyPair } from "@lindorm-io/crypto";
import { DeviceContext } from "../../typing";
import { config } from "../../config";
import { cryptoLayered } from "../../crypto";
import { includes } from "lodash";

interface RequestBody {
  certificateVerifier: string;
  challengeSessionToken: string;
  pincode: string;
  recoveryKey: string;
  biometry: string;
  strategy: ChallengeStrategy;
}

interface ResponseBody {
  challengeConfirmationToken: string;
  expiresIn: number;
}

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
      body: { certificateVerifier, pincode, recoveryKey, biometry, strategy },
    },
  } = ctx;

  logger.debug("challenge session verification requested", {
    id: challengeSession.id,
    clientId,
    deviceId: device.id,
    pincode,
    recoveryKey,
    scope: challengeSession.scope,
    biometry,
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
      await cryptoLayered.assert(pincode, device.pincode);
      break;

    case ChallengeStrategy.RECOVERY:
      await cryptoLayered.assert(recoveryKey, device.recoveryKey);
      break;

    case ChallengeStrategy.BIOMETRY:
      await cryptoLayered.assert(biometry, device.biometry);
      break;

    default:
      throw new ClientError("Invalid strategy", {
        debug: { strategy },
      });
  }

  const { expiresIn, token } = jwt.sign({
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
      expiresIn,
    },
    status: HttpStatus.Success.OK,
  };
};
