import { ClientError } from "@lindorm-io/errors";
import { DeviceContext } from "../typing";
import { Middleware } from "@lindorm-io/koa";
import { stringComparison } from "@lindorm-io/core";

export const challengeValidationMiddleware: Middleware<DeviceContext> = async (ctx, next) => {
  const metric = ctx.getMetric("entity");

  if (!stringComparison(ctx.entity.challenge.deviceId, ctx.entity.device.id)) {
    metric.end();

    throw new ClientError("Invalid Challenge", {
      debug: {
        device: {
          expect: ctx.entity.challenge.deviceId,
          actual: ctx.entity.device.id,
        },
      },
      statusCode: ClientError.StatusCode.BAD_REQUEST,
    });
  }

  metric.end();

  await next();
};
