import { Context } from "../../typing";
import {
  assertionMiddleware,
  createController,
  paramsMiddleware,
  Router,
  schemaMiddleware,
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
  enrolmentSessionEntityMiddleware,
  enrolmentSessionTokenMiddleware,
} from "../../middleware";

const router = new Router<unknown, Context>();
export default router;

router.post(
  "/",
  schemaMiddleware("data", enrolmentInitialiseSchema),

  bearerAuthMiddleware(),

  createController(enrolmentInitialiseController),
);

router.post(
  "/:id/confirm",
  paramsMiddleware,
  schemaMiddleware("data", enrolmentConfirmSchema),

  enrolmentSessionTokenMiddleware("data.enrolmentSessionToken"),
  assertionMiddleware("data.id", "token.enrolmentSessionToken.sessionId"),

  enrolmentSessionEntityMiddleware("data.id"),

  bearerAuthMiddleware({
    fromPath: {
      subject: "entity.enrolmentSession.identityId",
    },
  }),

  createController(enrolmentConfirmController),
);

router.post(
  "/:id/reject",
  paramsMiddleware,
  schemaMiddleware("data", enrolmentRejectSchema),

  enrolmentSessionTokenMiddleware("data.enrolmentSessionToken"),
  assertionMiddleware("data.id", "token.enrolmentSessionToken.sessionId"),

  enrolmentSessionEntityMiddleware("data.id"),

  bearerAuthMiddleware({
    fromPath: {
      subject: "entity.enrolmentSession.identityId",
    },
  }),

  createController(enrolmentRejectController),
);
