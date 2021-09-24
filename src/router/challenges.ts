import { Context } from "../typing";
import { includes } from "lodash";
import {
  Router,
  paramsMiddleware,
  useAssertion,
  useController,
  useSchema,
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
  useSchema(challengeInitialiseSchema),
  useAssertion({
    fromPath: { expect: "data.deviceId", actual: "metadata.device.id" },
  }),

  deviceEntityMiddleware("data.deviceId"),
  useAssertion({
    fromPath: { expect: "data.identityId", actual: "entity.device.identityId" },
  }),
  useAssertion({
    expect: true,
    fromPath: { actual: "entity.device.active" },
  }),
  useAssertion({
    expect: true,
    fromPath: { actual: "entity.device.trusted" },
  }),

  useController(challengeInitialiseController),
);

router.post(
  "/:id/confirm",
  paramsMiddleware,
  useSchema(challengeConfirmSchema),

  challengeSessionTokenMiddleware("data.challengeSessionToken"),
  useAssertion({
    fromPath: {
      expect: "data.id",
      actual: "token.challengeSessionToken.sessionId",
    },
  }),

  challengeSessionEntityMiddleware("data.id"),
  useAssertion({
    assertion: includes,
    fromPath: {
      expect: "entity.challengeSession.strategies",
      actual: "data.strategy",
    },
  }),

  deviceEntityMiddleware("entity.challengeSession.deviceId"),
  useAssertion({
    fromPath: {
      expect: "entity.device.id",
      actual: "metadata.device.id",
    },
  }),
  useAssertion({
    fromPath: {
      expect: "entity.device.installationId",
      actual: "metadata.device.installationId",
    },
  }),
  useAssertion({
    fromPath: {
      expect: "entity.device.uniqueId",
      actual: "metadata.device.uniqueId",
    },
  }),

  useController(challengeConfirmController),
);

router.post(
  "/:id/reject",
  paramsMiddleware,
  useSchema(challengeRejectSchema),

  challengeSessionTokenMiddleware("data.challengeSessionToken"),
  useAssertion({
    fromPath: {
      expect: "data.id",
      actual: "token.challengeSessionToken.sessionId",
    },
  }),

  challengeSessionEntityMiddleware("data.id"),

  useController(challengeRejectController),
);
