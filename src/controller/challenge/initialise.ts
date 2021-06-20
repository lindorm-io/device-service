import { Audience, ChallengeStrategy } from "../../enum";
import { ChallengeSession } from "../../entity";
import { ClientError } from "@lindorm-io/errors";
import { Controller, ControllerResponse, HttpStatus } from "@lindorm-io/koa";
import { DeviceContext } from "../../typing";
import { config } from "../../config";
import { getRandomValue, stringComparison } from "@lindorm-io/core";
import { sortedUniq } from "lodash";

interface RequestBody {
  accountId: string;
  deviceId: string;
  payload: Record<string, any>;
  scope: string;
}

interface ResponseBody {
  certificateChallenge: string;
  challengeSessionToken: string;
  expiresIn: number;
  strategies: Array<ChallengeStrategy>;
}

export const challengeInitialise: Controller<DeviceContext<RequestBody>> = async (
  ctx,
): Promise<ControllerResponse<ResponseBody>> => {
  const {
    cache: { challengeSessionCache },
    entity: { device },
    jwt,
    logger,
    metadata: { clientId, deviceId },
    request: {
      body: { accountId, payload, scope },
    },
  } = ctx;

  logger.debug("challenge session initialisation requested", {
    accountId,
    clientId,
    deviceId: device.id,
    payload,
    scope,
  });

  if (!stringComparison(device.id, deviceId)) {
    throw new ClientError("Device Conflict", {
      debug: {
        expect: device.id,
        actual: deviceId,
      },
      description: "Invalid device id",
      statusCode: ClientError.StatusCode.CONFLICT,
    });
  }
  if (!stringComparison(device.accountId, accountId)) {
    throw new ClientError("Device Conflict", {
      debug: {
        expect: device.accountId,
        actual: accountId,
      },
      description: "Invalid account id",
      statusCode: ClientError.StatusCode.CONFLICT,
    });
  }

  const strategies: Array<ChallengeStrategy> = [
    ChallengeStrategy.IMPLICIT,
    ChallengeStrategy.RECOVERY,
    ChallengeStrategy.PINCODE,
  ];

  if (device.biometry) {
    strategies.push(ChallengeStrategy.BIOMETRY);
  }

  const { id, expiresIn, token } = jwt.sign({
    audience: Audience.CHALLENGE_SESSION,
    clientId,
    deviceId: device.id,
    expiry: config.CHALLENGE_SESSION_EXPIRY,
    subject: device.accountId,
  });

  const challengeSession = await challengeSessionCache.create(
    new ChallengeSession({
      id,
      certificateChallenge: getRandomValue(64),
      deviceId: device.id,
      payload,
      scope: scope.split(" "),
      strategies,
    }),
    expiresIn,
  );

  logger.info("challenge session initialised");

  return {
    body: {
      certificateChallenge: challengeSession.certificateChallenge,
      challengeSessionToken: token,
      expiresIn,
      strategies: sortedUniq(strategies),
    },
    status: HttpStatus.Success.OK,
  };
};
