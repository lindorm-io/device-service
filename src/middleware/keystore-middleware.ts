import { IWebKeyMiddlewareOptions, webKeyMiddleware } from "@lindorm-io/koa-jwt";
import { Middleware } from "koa";
import { NodeEnvironment } from "@lindorm-io/core";
import { WEB_KEY_MW_OPTIONS, NODE_ENVIRONMENT } from "../config";
import { inMemoryKeys } from "../test";
import { winston } from "../logger";

export const getWebKeyMiddleware = (): Middleware => {
  const isTest = NODE_ENVIRONMENT === NodeEnvironment.TEST;
  const options: IWebKeyMiddlewareOptions = {
    ...WEB_KEY_MW_OPTIONS,
    logger: winston,
  };

  return webKeyMiddleware({
    ...options,
    inMemoryKeys: isTest ? inMemoryKeys : [],
  });
};
