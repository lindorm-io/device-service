import Joi from "@hapi/joi";
import { IKoaDeviceContext } from "../typing";
import { InvalidDeviceError } from "../error";
import { TPromise } from "@lindorm-io/core";

const schema = Joi.object({
  deviceId: Joi.string().guid().required(),
});

export const deviceMiddleware = async (ctx: IKoaDeviceContext, next: TPromise<void>): Promise<void> => {
  const start = Date.now();

  const { logger, repository } = ctx;
  const { deviceId } = ctx.request.body;

  try {
    await schema.validateAsync({ deviceId });

    ctx.device = await repository.device.find({ id: deviceId });

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
