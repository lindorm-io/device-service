import { KoaApp } from "@lindorm-io/koa";
import { config, IS_TEST } from "../config";
import { join } from "path";
import { serverMiddlewares } from "../middleware";
import { winston } from "../logger";
import {
  keyPairJwksWorker,
  keyPairCacheWorker,
  keyPairCleanupWorker,
  keyPairRotationWorker,
} from "../worker";

export const koa = new KoaApp({
  host: config.HOST,
  logger: winston,
  port: config.SERVER_PORT,
});

koa.addMiddlewares(serverMiddlewares);
koa.addRoutesAutomatically(join(__dirname, "..", "router"));

// workers
if (!IS_TEST) {
  koa.addWorker(keyPairJwksWorker);
  koa.addWorker(keyPairCacheWorker);
  koa.addWorker(keyPairRotationWorker);
  koa.addWorker(keyPairCleanupWorker);
}
