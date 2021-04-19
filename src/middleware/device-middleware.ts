import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../typing";
import { InvalidDeviceError, InvalidPermissionError } from "../error";
import { Next } from "@lindorm-io/koa";
import { stringComparison } from "@lindorm-io/core";

const schema = Joi.object({
  accountId: Joi.string().guid().required(),
  deviceId: Joi.string().guid().required(),
});

export const deviceMiddleware = async (ctx: IKoaDeviceContext, next: Next): Promise<void> => {
  const start = Date.now();

  const {
    logger,
    repository: { deviceRepository },
  } = ctx;
  const { accountId, deviceId } = ctx.request.body;

  await schema.validateAsync({ accountId, deviceId });

  try {
    ctx.entity.device = await deviceRepository.find({ id: deviceId });

    if (!stringComparison(ctx.entity.device.accountId, accountId)) {
      throw new InvalidPermissionError();
    }

    logger.debug("device found", { deviceId });
  } catch (err) {
    throw new InvalidDeviceError(deviceId, err);
  }

  ctx.metrics = {
    ...(ctx.metrics || {}),
    device: Date.now() - start,
  };

  await next();
};
