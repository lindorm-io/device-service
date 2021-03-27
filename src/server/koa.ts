import { KoaApp } from "@lindorm-io/koa";
import { SERVER_PORT, TOKEN_ISSUER_MW_OPTIONS } from "../config";
import { appRoute, deviceRoute, enrolmentRoute, headlessRoute } from "../route";
import { getMongoMiddleware, getWebKeyMiddleware, repositoryMiddleware } from "../middleware";
import { tokenIssuerMiddleware } from "@lindorm-io/koa-jwt";
import { winston } from "../logger";
import { getRedisMiddleware } from "../middleware/redis-middleware";
import { cacheMiddleware } from "../middleware/cache-middleware";

export const koa = new KoaApp({
  logger: winston,
  port: SERVER_PORT,
});

koa.addMiddleware(getMongoMiddleware());
koa.addMiddleware(repositoryMiddleware);

koa.addMiddleware(getRedisMiddleware());
koa.addMiddleware(cacheMiddleware);
koa.addMiddleware(getWebKeyMiddleware());
koa.addMiddleware(tokenIssuerMiddleware(TOKEN_ISSUER_MW_OPTIONS));

koa.addRoute("/", appRoute);
koa.addRoute("/device", deviceRoute);
koa.addRoute("/enrolment", enrolmentRoute);
koa.addRoute("/headless", headlessRoute);
