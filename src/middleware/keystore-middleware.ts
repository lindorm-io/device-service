import { Middleware } from "koa";
import { WEB_KEY_MW_OPTIONS, IS_TEST } from "../config";
import { inMemoryKeys } from "../test";
import { webKeyMiddleware } from "@lindorm-io/koa-jwt";

export const getWebKeyMiddleware = (): Middleware =>
  webKeyMiddleware({
    ...WEB_KEY_MW_OPTIONS,
    inMemoryKeys: IS_TEST ? inMemoryKeys : undefined,
  });
