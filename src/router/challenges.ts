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
  assertionMiddleware({
    fromPath: { expect: "data.deviceId", actual: "metadata.device.id" },
  }),

  deviceEntityMiddleware("data.deviceId"),
  assertionMiddleware({
    fromPath: { expect: "data.identityId", actual: "entity.device.identityId" },
  }),

  createController(challengeInitialiseController),
);

router.post(
  "/:id/confirm",
  paramsMiddleware,
  schemaMiddleware("data", challengeConfirmSchema),

  challengeSessionTokenMiddleware("data.challengeSessionToken"),
  assertionMiddleware({
    fromPath: {
      expect: "data.id",
      actual: "token.challengeSessionToken.sessionId",
    },
  }),

  challengeSessionEntityMiddleware("data.id"),
  assertionMiddleware({
    assertion: includes,
    fromPath: {
      expect: "entity.challengeSession.strategies",
      actual: "data.strategy",
    },
  }),

  deviceEntityMiddleware("entity.challengeSession.deviceId"),
  assertionMiddleware({
    fromPath: {
      expect: "entity.device.id",
      actual: "metadata.device.id",
    },
  }),
  assertionMiddleware({
    fromPath: {
      expect: "entity.device.installationId",
      actual: "metadata.device.installationId",
    },
  }),
  assertionMiddleware({
    fromPath: {
      expect: "entity.device.uniqueId",
      actual: "metadata.device.uniqueId",
    },
  }),

  createController(challengeConfirmController),
);

router.post(
  "/:id/reject",
  paramsMiddleware,
  schemaMiddleware("data", challengeRejectSchema),

  challengeSessionTokenMiddleware("data.challengeSessionToken"),
  assertionMiddleware({
    fromPath: {
      expect: "data.id",
      actual: "token.challengeSessionToken.sessionId",
    },
  }),

  challengeSessionEntityMiddleware("data.id"),

  createController(challengeRejectController),
);
