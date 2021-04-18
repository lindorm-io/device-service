import { KoaApp } from "@lindorm-io/koa";
import { config, IS_TEST } from "../config";
import { accountRoute, challengeRoute, deviceRoute, enrolmentRoute, wellKnownRoute } from "../route";
import { authJwksCacheWorker, keyPairCacheWorker } from "../worker";
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
  authTokenHandlerMiddleware,
  challengeHandlerMiddleware,
  deviceHandlerMiddleware,
  enrolmentHandlerMiddleware,
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

// handlers
koa.addMiddleware(authTokenHandlerMiddleware);
koa.addMiddleware(challengeHandlerMiddleware);
koa.addMiddleware(deviceHandlerMiddleware);
koa.addMiddleware(enrolmentHandlerMiddleware);

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
