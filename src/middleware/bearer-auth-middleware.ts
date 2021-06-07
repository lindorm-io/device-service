import { bearerAuthMiddleware as _bearerAuthMiddleware } from "@lindorm-io/koa-bearer-auth";
import { config } from "../config";

export const bearerAuthMiddleware = _bearerAuthMiddleware({
  issuer: config.AUTH_JWT_ISSUER,
});
