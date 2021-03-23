import { Middleware } from "koa";
import { WEB_KEY_MW_OPTIONS, IS_TEST } from "../config";
import { inMemoryKeys } from "../test";
import { jsonWebKeySetMiddleware } from "@lindorm-io/koa-jwks";

export const getWebKeyMiddleware = (): Middleware =>
  jsonWebKeySetMiddleware({
    ...WEB_KEY_MW_OPTIONS,
    inMemoryKeys: IS_TEST ? inMemoryKeys : undefined,
  });
