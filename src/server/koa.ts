import { KoaApp } from "@lindorm-io/koa";
import { SERVER_PORT, TOKEN_ISSUER_MW_OPTIONS } from "../config";
import { appRoute, deviceRoute, verifyRoute } from "../route";
import { getMongoMiddleware, getWebKeyMiddleware, repositoryMiddleware } from "../middleware";
import { tokenIssuerMiddleware } from "@lindorm-io/koa-jwt";
import { winston } from "../logger";

export const koa = new KoaApp({
  logger: winston,
  port: SERVER_PORT,
});

koa.addMiddleware(getMongoMiddleware());
koa.addMiddleware(repositoryMiddleware);
koa.addMiddleware(getWebKeyMiddleware());
koa.addMiddleware(tokenIssuerMiddleware(TOKEN_ISSUER_MW_OPTIONS));

koa.addRoute("/", appRoute);
koa.addRoute("/device", deviceRoute);
koa.addRoute("/verify", verifyRoute);
