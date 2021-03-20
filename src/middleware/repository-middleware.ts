import { DeviceRepository } from "../infrastructure";
import { IKoaDeviceContext } from "../typing";
import { TPromise } from "@lindorm-io/core";

export const repositoryMiddleware = async (ctx: IKoaDeviceContext, next: TPromise<void>): Promise<void> => {
  const start = Date.now();

  const { logger, mongo } = ctx;
  const db = await mongo.getDatabase();

  ctx.repository = {
    device: new DeviceRepository({ db, logger }),
  };

  logger.debug("repositories connected");

  ctx.metrics = {
    ...(ctx.metrics || {}),
    repository: Date.now() - start,
  };

  await next();
};
