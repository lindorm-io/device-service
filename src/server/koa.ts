import { AuthTokenHandler, ChallengeHandler, DeviceHandler, EnrolmentHandler } from "../handler";
import { accountRoute, challengeRoute, deviceRoute, enrolmentRoute, wellKnownRoute } from "../route";
import { authJwksCacheWorker, keyPairCacheWorker, keyPairCleanupWorker } from "../worker";
import { cacheKeysMiddleware, keystoreMiddleware } from "@lindorm-io/koa-keystore";
import { config, IS_TEST } from "../config";
import { handlerMiddleware, KoaApp } from "@lindorm-io/koa";
import { winston } from "../logger";
import {
  challengeCacheMiddleware,
  deviceRepositoryMiddleware,
  enrolmentCacheMiddleware,
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
koa.addMiddleware(challengeCacheMiddleware);
koa.addMiddleware(enrolmentCacheMiddleware);
koa.addMiddleware(keyPairCacheMiddleware);

// jwt
koa.addMiddleware(cacheKeysMiddleware);
koa.addMiddleware(keystoreMiddleware);
koa.addMiddleware(tokenIssuerMiddleware);

// handlers
koa.addMiddleware(handlerMiddleware(AuthTokenHandler));
koa.addMiddleware(handlerMiddleware(ChallengeHandler));
koa.addMiddleware(handlerMiddleware(DeviceHandler));
koa.addMiddleware(handlerMiddleware(EnrolmentHandler));

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
  koa.addWorker(keyPairCleanupWorker);
}
