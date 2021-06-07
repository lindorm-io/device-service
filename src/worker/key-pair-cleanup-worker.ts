import { MONGO_CONNECTION_OPTIONS } from "../config";
import { keyPairCleanupWorker as _keyPairCleanupWorker } from "@lindorm-io/koa-keystore";
import { stringToSeconds } from "@lindorm-io/core";
import { winston } from "../logger";

export const keyPairCleanupWorker = _keyPairCleanupWorker({
  mongoConnectionOptions: MONGO_CONNECTION_OPTIONS,
  winston,
  workerIntervalInSeconds: stringToSeconds("5 minutes"),
});
