import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../typing";
import { InvalidDeviceError, InvalidPermissionError } from "../error";
import { stringComparison, TPromise } from "@lindorm-io/core";

const schema = Joi.object({
  accountId: Joi.string().guid().required(),
  deviceId: Joi.string().guid().required(),
});

export const deviceMiddleware = async (ctx: IKoaDeviceContext, next: TPromise<void>): Promise<void> => {
  const start = Date.now();

  const { logger, repository } = ctx;
  const { accountId, deviceId } = ctx.request.body;

  await schema.validateAsync({ accountId, deviceId });

  try {
    const device = await repository.device.find({ id: deviceId });

    if (!stringComparison(device.accountId, accountId)) {
      throw new InvalidPermissionError();
    }

    ctx.device = device;

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
