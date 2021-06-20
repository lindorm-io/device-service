import { MONGO_CONNECTION_OPTIONS } from "../config";
import { keyPairRotationWorker as _keyPairRotationWorker } from "@lindorm-io/koa-keystore";
import { winston } from "../logger";

export const keyPairRotationWorker = _keyPairRotationWorker({
  mongoConnectionOptions: MONGO_CONNECTION_OPTIONS,
  winston,
});
