import { keyPairCleanupWorker as _keyPairCleanupWorker } from "@lindorm-io/koa-keystore";
import { mongoConnection } from "../instance";
import { winston } from "../logger";

export const keyPairCleanupWorker = _keyPairCleanupWorker({
  mongoConnection,
  winston,
});
