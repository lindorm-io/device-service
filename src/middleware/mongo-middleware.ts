import { MongoConnectionType } from "@lindorm-io/mongo";
import { IS_TEST, MONGO_CONNECTION_OPTIONS } from "../config";
import { inMemoryStore } from "../test";
import { mongoMiddleware as _mongoMiddleware } from "@lindorm-io/koa-mongo";

export const mongoMiddleware = _mongoMiddleware({
  ...MONGO_CONNECTION_OPTIONS,
  type: IS_TEST ? MongoConnectionType.MEMORY : MONGO_CONNECTION_OPTIONS.type,
  inMemoryStore: IS_TEST ? inMemoryStore : undefined,
});
