import Joi from "joi";
import { ClientError } from "@lindorm-io/errors";
import { DeviceContext } from "../typing";
import { Middleware } from "@lindorm-io/koa";
import { stringComparison } from "@lindorm-io/core";

const schema = Joi.object({
  accountId: Joi.string().guid().required(),
});

export const deviceValidationMiddleware: Middleware<DeviceContext> = async (ctx, next): Promise<void> => {
  const metric = ctx.getMetric("entity");

  const {
    request: {
      body: { accountId },
    },
  } = ctx;

  await schema.validateAsync({ accountId });

  if (!stringComparison(ctx.entity.device.accountId, accountId)) {
    metric.end();

    throw new ClientError("Invalid Device", {
      debug: {
        account: {
          expect: ctx.entity.device.accountId,
          actual: accountId,
        },
      },
      statusCode: ClientError.StatusCode.BAD_REQUEST,
    });
  }

  metric.end();

  await next();
};
