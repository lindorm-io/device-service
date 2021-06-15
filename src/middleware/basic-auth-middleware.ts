import { BASIC_AUTH_CLIENTS } from "../config";
import { basicAuthMiddleware as _basicAuthMiddleware } from "@lindorm-io/koa-basic-auth";

export const basicAuthMiddleware = _basicAuthMiddleware(BASIC_AUTH_CLIENTS);
