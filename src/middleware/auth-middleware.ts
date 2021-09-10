import { BASIC_AUTH_CLIENTS } from "../config";
import { basicAuthMiddleware as _basicAuthMiddleware } from "@lindorm-io/koa-basic-auth";
import { bearerAuthMiddleware as _bearerAuthMiddleware } from "@lindorm-io/koa-bearer-auth";
import { config } from "../config";

export const basicAuthMiddleware = _basicAuthMiddleware(BASIC_AUTH_CLIENTS);

export const bearerAuthMiddleware = _bearerAuthMiddleware({
  issuer: config.BEARER_TOKEN_ISSUER,
});
