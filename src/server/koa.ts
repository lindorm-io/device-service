import { KoaApp } from "@lindorm-io/koa";
import { accountRoute, challengeRoute, deviceRoute, enrolmentRoute, wellKnownRoute } from "../route";
import { authJwksCacheWorker, keyPairCacheWorker, keyPairCleanupWorker, keyPairRotationWorker } from "../worker";
import { cacheKeysMiddleware, keystoreMiddleware } from "@lindorm-io/koa-keystore";
import { config, IS_TEST } from "../config";
import { winston } from "../logger";
import {
  challengeSessionCacheMiddleware,
  deviceRepositoryMiddleware,
  enrolmentSessionCacheMiddleware,
  keyPairCacheMiddleware,
  keyPairRepositoryMiddleware,
  mongoMiddleware,
  redisMiddleware,
  tokenIssuerMiddleware,
} from "../middleware";

export const koa = new KoaApp({
  logger: winston,
  port: config.SERVER_PORT,
});

// mongo
koa.addMiddleware(mongoMiddleware);
koa.addMiddleware(deviceRepositoryMiddleware);
koa.addMiddleware(keyPairRepositoryMiddleware);

// redis
koa.addMiddleware(redisMiddleware);
koa.addMiddleware(challengeSessionCacheMiddleware);
koa.addMiddleware(enrolmentSessionCacheMiddleware);
koa.addMiddleware(keyPairCacheMiddleware);

// jwt
koa.addMiddleware(cacheKeysMiddleware);
koa.addMiddleware(keystoreMiddleware);
koa.addMiddleware(tokenIssuerMiddleware);

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
  koa.addWorker(keyPairRotationWorker);
  koa.addWorker(keyPairCleanupWorker);
}
