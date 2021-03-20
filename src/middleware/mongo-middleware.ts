import { IS_TEST, MONGO_CONNECTION_OPTIONS } from "../config";
import { Middleware } from "koa";
import { MongoConnectionType } from "@lindorm-io/mongo";
import { inMemoryStore } from "../test";
import { mongoMiddleware } from "@lindorm-io/koa-mongo";

export const getMongoMiddleware = (): Middleware =>
  mongoMiddleware({
    ...MONGO_CONNECTION_OPTIONS,
    type: IS_TEST ? MongoConnectionType.MEMORY : MONGO_CONNECTION_OPTIONS.type,
    inMemoryStore: IS_TEST ? inMemoryStore : undefined,
  });
