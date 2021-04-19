import { KoaApp } from "@lindorm-io/koa";
import { accountRoute, challengeRoute, deviceRoute, enrolmentRoute, wellKnownRoute } from "../route";
import { authJwksCacheWorker, keyPairCacheWorker } from "../worker";
import { config, IS_TEST } from "../config";
import { keyPairRepositoryMiddleware } from "@lindorm-io/koa-keystore";
import { winston } from "../logger";
import {
  redisMiddleware,
  authKeyPairCacheMiddleware,
  authKeystoreMiddleware,
  authTokenIssuerMiddleware,
  deviceKeyPairCacheMiddleware,
  deviceKeystoreMiddleware,
  deviceTokenIssuerMiddleware,
  mongoMiddleware,
  enrolmentCacheMiddleware,
  challengeCacheMiddleware,
  deviceRepositoryMiddleware,
} from "../middleware";

export const koa = new KoaApp({
  logger: winston,
  port: config.SERVER_PORT,
});

// mongo
koa.addMiddleware(mongoMiddleware);
koa.addMiddleware(keyPairRepositoryMiddleware);
koa.addMiddleware(deviceRepositoryMiddleware);

// redis
koa.addMiddleware(redisMiddleware);
koa.addMiddleware(authKeyPairCacheMiddleware);
koa.addMiddleware(deviceKeyPairCacheMiddleware);
koa.addMiddleware(challengeCacheMiddleware);
koa.addMiddleware(enrolmentCacheMiddleware);

// auth tokens
koa.addMiddleware(authKeystoreMiddleware);
koa.addMiddleware(authTokenIssuerMiddleware);

// device tokens
koa.addMiddleware(deviceKeystoreMiddleware);
koa.addMiddleware(deviceTokenIssuerMiddleware);

// routes
koa.addRoute("/account", accountRoute);
koa.addRoute("/challenge", challengeRoute);
koa.addRoute("/device", deviceRoute);
koa.addRoute("/enrolment", enrolmentRoute);
koa.addRoute("/.well-known", wellKnownRoute);

// workers
if (!IS_TEST) {
  koa.addWorker(authJwksCacheWorker);
  koa.addWorker(keyPairCacheWorker);
}
