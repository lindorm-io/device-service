import { TokenType } from "../enum";
import { config } from "../config";
import { tokenValidationMiddleware } from "@lindorm-io/koa-jwt";

export const challengeConfirmationTokenMiddleware = tokenValidationMiddleware({
  contextKey: "challengeConfirmationToken",
  issuer: config.HOST,
  types: [TokenType.CHALLENGE_CONFIRMATION_TOKEN],
});

export const challengeSessionTokenMiddleware = tokenValidationMiddleware({
  contextKey: "challengeSessionToken",
  issuer: config.HOST,
  types: [TokenType.CHALLENGE_SESSION_TOKEN],
});

export const enrolmentSessionTokenMiddleware = tokenValidationMiddleware({
  contextKey: "enrolmentSessionToken",
  issuer: config.HOST,
  types: [TokenType.ENROLMENT_SESSION_TOKEN],
});
