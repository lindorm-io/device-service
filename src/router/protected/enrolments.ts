import { Context } from "../../typing";
import {
  Router,
  paramsMiddleware,
  useAssertion,
  useController,
  useSchema,
} from "@lindorm-io/koa";
import {
  enrolmentConfirmController,
  enrolmentConfirmSchema,
  enrolmentInitialiseController,
  enrolmentInitialiseSchema,
  enrolmentRejectController,
  enrolmentRejectSchema,
} from "../../controller";
import {
  bearerAuthMiddleware,
  challengeConfirmationTokenMiddleware,
  enrolmentSessionEntityMiddleware,
  enrolmentSessionTokenMiddleware,
} from "../../middleware";

const router = new Router<unknown, Context>();
export default router;

router.post(
  "/",
  useSchema(enrolmentInitialiseSchema),

  bearerAuthMiddleware(),

  useController(enrolmentInitialiseController),
);

router.post(
  "/:id/confirm",
  paramsMiddleware,
  useSchema(enrolmentConfirmSchema),

  enrolmentSessionTokenMiddleware("data.enrolmentSessionToken"),
  useAssertion({
    fromPath: {
      expect: "data.id",
      actual: "token.enrolmentSessionToken.sessionId",
    },
  }),

  enrolmentSessionEntityMiddleware("data.id"),

  bearerAuthMiddleware({
    fromPath: {
      subject: "entity.enrolmentSession.identityId",
    },
  }),

  challengeConfirmationTokenMiddleware("data.challengeConfirmationToken", {
    optional: true,
  }),

  useController(enrolmentConfirmController),
);

router.post(
  "/:id/reject",
  paramsMiddleware,
  useSchema(enrolmentRejectSchema),

  enrolmentSessionTokenMiddleware("data.enrolmentSessionToken"),
  useAssertion({
    fromPath: {
      expect: "data.id",
      actual: "token.enrolmentSessionToken.sessionId",
    },
  }),

  enrolmentSessionEntityMiddleware("data.id"),

  bearerAuthMiddleware({
    fromPath: {
      subject: "entity.enrolmentSession.identityId",
    },
  }),

  useController(enrolmentRejectController),
);
