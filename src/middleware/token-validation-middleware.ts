import { IKoaDeviceContext } from "../typing";
import { isString } from "lodash";
import { Audience } from "../enum";
import { sanitiseToken } from "@lindorm-io/jwt";
import { TNext } from "@lindorm-io/koa";

export const tokenValidationMiddleware = async (ctx: IKoaDeviceContext, next: TNext) => {
  const start = Date.now();

  const { issuer, logger, metadata } = ctx;
  const { challengeConfirmationToken } = ctx.request.body;

  if (isString(challengeConfirmationToken)) {
    const verified = issuer.device.verify({
      audience: Audience.CHALLENGE_CONFIRMATION,
      clientId: metadata.clientId,
      deviceId: metadata.deviceId,
      token: challengeConfirmationToken,
    });

    ctx.token = {
      ...(ctx.token || {}),
      challengeConfirmation: verified,
    };
  }

  logger.debug("tokens validated", {
    challengeConfirmation: sanitiseToken(challengeConfirmationToken),
  });

  ctx.metrics = {
    ...(ctx.metrics || {}),
    tokenValidation: Date.now() - start,
  };

  await next();
};
