import { Audience } from "../enum";
import { tokenValidationMiddleware } from "@lindorm-io/koa-jwt";
import { config } from "../config";

export const challengeConfirmationTokenMiddleware = tokenValidationMiddleware({
  audience: Audience.CHALLENGE_CONFIRMATION,
  issuer: config.DEVICE_JWT_ISSUER,
  key: "challengeConfirmationToken",
  path: "request.body.challengeConfirmationToken",
});

export const challengeSessionTokenMiddleware = tokenValidationMiddleware({
  audience: Audience.CHALLENGE_SESSION,
  issuer: config.DEVICE_JWT_ISSUER,
  key: "challengeSessionToken",
  path: "request.body.challengeSessionToken",
});

export const enrolmentSessionTokenMiddleware = tokenValidationMiddleware({
  audience: Audience.ENROLMENT_SESSION,
  issuer: config.DEVICE_JWT_ISSUER,
  key: "enrolmentSessionToken",
  path: "request.body.enrolmentSessionToken",
});
