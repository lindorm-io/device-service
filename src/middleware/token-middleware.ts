import { Audience } from "../enum";
import { tokenValidationMiddleware } from "@lindorm-io/koa-jwt";
import { config } from "../config";

export const challengeConfirmationTokenMiddleware = tokenValidationMiddleware({
  audience: Audience.CHALLENGE_CONFIRMATION,
  issuer: config.DEVICE_JWT_ISSUER,
  key: "challengeConfirmation",
  path: "request.body.challengeConfirmationToken",
});
