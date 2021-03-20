import { IMongoConnectionOptions, MongoConnectionType } from "@lindorm-io/mongo";
import { MONGO_CONNECTION_OPTIONS, NODE_ENVIRONMENT } from "../config";
import { Middleware } from "koa";
import { NodeEnvironment } from "@lindorm-io/core";
import { inMemoryStore } from "../test";
import { mongoMiddleware } from "@lindorm-io/koa-mongo";

export const getMongoMiddleware = (): Middleware => {
  const isTest = NODE_ENVIRONMENT === NodeEnvironment.TEST;
  const options: IMongoConnectionOptions = MONGO_CONNECTION_OPTIONS;

  return mongoMiddleware({
    ...options,
    type: isTest ? MongoConnectionType.MEMORY : options.type,
    inMemoryStore: isTest ? inMemoryStore : undefined,
  });
};
