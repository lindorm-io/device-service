import Joi from "joi";
import { ChallengeSession } from "../../entity";
import { ChallengeStrategy, TokenType } from "../../enum";
import { Context } from "../../typing";
import { Controller, ControllerResponse } from "@lindorm-io/koa";
import { JOI_GUID } from "../../constant";
import { config } from "../../config";
import { getRandomValue, stringToSeconds } from "@lindorm-io/core";
import { sortedUniq } from "lodash";

interface RequestData {
  deviceId: string;
  identityId: string;
  nonce: string;
  payload: Record<string, any>;
  scope: string;
}

interface ResponseData {
  certificateChallenge: string;
  challengeSessionToken: string;
  expiresIn: number;
  strategies: Array<ChallengeStrategy>;
}

export const challengeInitialiseSchema = Joi.object<RequestData>({
  deviceId: JOI_GUID.required(),
  identityId: JOI_GUID.required(),
  nonce: Joi.string().required(),
  payload: Joi.object().required(),
  scope: Joi.string().required(),
});

export const challengeInitialiseController: Controller<Context<RequestData>> = async (
  ctx,
): ControllerResponse<ResponseData> => {
  const {
    cache: { challengeSessionCache },
    data: { nonce, payload, scope },
    entity: { device },
    jwt,
    metadata: {
      client: { id: clientId },
    },
  } = ctx;

  const scopes = scope.split(" ");

  const strategies: Array<ChallengeStrategy> = [ChallengeStrategy.IMPLICIT];

  if (device.biometry) {
    strategies.push(ChallengeStrategy.BIOMETRY);
  }

  if (device.pincode) {
    strategies.push(ChallengeStrategy.PINCODE);
  }

  const certificateChallenge = getRandomValue(128);
  const expiresIn = stringToSeconds(config.EXPIRY_CHALLENGE_SESSION);

  const session = await challengeSessionCache.create(
    new ChallengeSession({
      certificateChallenge,
      deviceId: device.id,
      nonce,
      payload,
      scopes,
      strategies,
    }),
    expiresIn,
  );

  const { token } = jwt.sign({
    audiences: [clientId],
    expiry: config.EXPIRY_CHALLENGE_SESSION,
    sessionId: session.id,
    subject: device.identityId,
    subjectHint: "identity",
    type: TokenType.CHALLENGE_SESSION_TOKEN,
  });

  return {
    data: {
      certificateChallenge,
      challengeSessionToken: token,
      expiresIn,
      strategies: sortedUniq(strategies),
    },
  };
};
