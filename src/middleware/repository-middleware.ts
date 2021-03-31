import { DeviceRepository } from "../infrastructure";
import { IKoaDeviceContext, TNext } from "../typing";

export const repositoryMiddleware = async (ctx: IKoaDeviceContext, next: TNext): Promise<void> => {
  const start = Date.now();

  const { logger, mongo } = ctx;
  const db = await mongo.getDatabase();

  ctx.repository = {
    ...ctx.repository,
    device: new DeviceRepository({ db, logger }),
  };

  logger.debug("repositories connected");

  ctx.metrics = {
    ...(ctx.metrics || {}),
    repository: Date.now() - start,
  };

  await next();
};
