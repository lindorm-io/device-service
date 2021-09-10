import { TokenType } from "../enum";
import { tokenValidationMiddleware } from "@lindorm-io/koa-jwt";
import { config } from "../config";

export const challengeConfirmationTokenMiddleware = tokenValidationMiddleware({
  issuer: config.HOST,
  key: "challengeConfirmationToken",
  types: [TokenType.CHALLENGE_CONFIRMATION_TOKEN],
});

export const challengeSessionTokenMiddleware = tokenValidationMiddleware({
  issuer: config.HOST,
  key: "challengeSessionToken",
  types: [TokenType.CHALLENGE_SESSION_TOKEN],
});

export const enrolmentSessionTokenMiddleware = tokenValidationMiddleware({
  issuer: config.HOST,
  key: "enrolmentSessionToken",
  types: [TokenType.ENROLMENT_SESSION_TOKEN],
});
