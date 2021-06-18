import { DeviceContext } from "../typing";
import { Router } from "@lindorm-io/koa";
import { challengeInitialise, challengeInitialiseSchema, challengeVerify, challengeVerifySchema } from "../controller";
import { createController, schemaMiddleware } from "@lindorm-io/koa";
import {
  basicAuthMiddleware,
  challengeSessionEntityMiddleware,
  challengeSessionTokenMiddleware,
  deviceEntityMiddleware,
} from "../middleware";

export const router = new Router<unknown, DeviceContext>();

router.use(basicAuthMiddleware);

router.post(
  "/initialise",
  schemaMiddleware("request.body", challengeInitialiseSchema),
  deviceEntityMiddleware("request.body.deviceId"),
  createController(challengeInitialise),
);

router.post(
  "/verify",
  schemaMiddleware("request.body", challengeVerifySchema),
  challengeSessionTokenMiddleware("request.body.challengeSessionToken"),
  challengeSessionEntityMiddleware("token.challengeSessionToken.id"),
  deviceEntityMiddleware("token.challengeSessionToken.deviceId"),
  createController(challengeVerify),
);
