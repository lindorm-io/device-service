import { Context } from "../typing";
import { includes } from "lodash";
import {
  assertionMiddleware,
  createController,
  paramsMiddleware,
  Router,
  schemaMiddleware,
} from "@lindorm-io/koa";
import {
  challengeConfirmController,
  challengeConfirmSchema,
  challengeInitialiseController,
  challengeInitialiseSchema,
  challengeRejectController,
  challengeRejectSchema,
} from "../controller";
import {
  challengeSessionEntityMiddleware,
  challengeSessionTokenMiddleware,
  deviceEntityMiddleware,
} from "../middleware";

const router = new Router<unknown, Context>();
export default router;

router.post(
  "/",
  schemaMiddleware("data", challengeInitialiseSchema),
  assertionMiddleware("data.deviceId", "metadata.device.id"),

  deviceEntityMiddleware("data.deviceId"),
  assertionMiddleware("data.identityId", "entity.device.identityId"),

  createController(challengeInitialiseController),
);

router.post(
  "/:id/confirm",
  paramsMiddleware,
  schemaMiddleware("data", challengeConfirmSchema),

  challengeSessionTokenMiddleware("data.challengeSessionToken"),
  assertionMiddleware("data.id", "token.challengeSessionToken.sessionId"),

  challengeSessionEntityMiddleware("data.id"),
  assertionMiddleware("entity.challengeSession.strategies", "data.strategy", includes),

  deviceEntityMiddleware("entity.challengeSession.deviceId"),
  assertionMiddleware("entity.device.id", "metadata.device.id"),
  assertionMiddleware("entity.device.installationId", "metadata.device.installationId"),
  assertionMiddleware("entity.device.uniqueId", "metadata.device.uniqueId"),

  createController(challengeConfirmController),
);

router.post(
  "/:id/reject",
  paramsMiddleware,
  schemaMiddleware("data", challengeRejectSchema),

  challengeSessionTokenMiddleware("data.challengeSessionToken"),
  assertionMiddleware("data.id", "token.challengeSessionToken.sessionId"),

  challengeSessionEntityMiddleware("data.id"),

  createController(challengeRejectController),
);
