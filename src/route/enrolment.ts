import { DeviceContext } from "../typing";
import { Router } from "@lindorm-io/koa";
import { Scope } from "../enum";
import { bearerAuthMiddleware, enrolmentSessionEntityMiddleware, enrolmentSessionTokenMiddleware } from "../middleware";
import { createController, schemaMiddleware } from "@lindorm-io/koa";
import { enrolmentInitialise, enrolmentInitialiseSchema, enrolmentVerify, enrolmentVerifySchema } from "../controller";

export const router = new Router<unknown, DeviceContext>();

router.use(bearerAuthMiddleware([Scope.DEFAULT]));

router.post(
  "/initialise",
  schemaMiddleware("request.body", enrolmentInitialiseSchema),
  createController(enrolmentInitialise),
);

router.post(
  "/verify",
  schemaMiddleware("request.body", enrolmentVerifySchema),
  enrolmentSessionTokenMiddleware("request.body.enrolmentSessionToken"),
  enrolmentSessionEntityMiddleware("token.enrolmentSessionToken.id"),
  createController(enrolmentVerify),
);
