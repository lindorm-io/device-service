import { AUTH_TOKEN_ISSUER_NAME } from "../constant";
import { Audience } from "../enum";
import { bearerAuthMiddleware as _bearerAuthMiddleware } from "@lindorm-io/koa-bearer-auth";
import { config } from "../config";

export const bearerAuthMiddleware = _bearerAuthMiddleware({
  audience: Audience.ACCESS,
  issuer: config.AUTH_JWT_ISSUER,
  issuerName: AUTH_TOKEN_ISSUER_NAME,
});
