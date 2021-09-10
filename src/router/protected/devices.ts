import { Context } from "../../typing";
import {
  assertionMiddleware,
  createController,
  paramsMiddleware,
  Router,
  schemaMiddleware,
} from "@lindorm-io/koa";
import {
  deviceGetController,
  deviceGetListController,
  deviceGetSchema,
  deviceRemoveController,
  deviceRemoveSchema,
  deviceUpdateBiometryController,
  deviceUpdateBiometrySchema,
  deviceUpdatePincodeController,
  deviceUpdatePincodeSchema,
} from "../../controller";
import {
  bearerAuthMiddleware,
  challengeConfirmationTokenMiddleware,
  deviceEntityMiddleware,
} from "../../middleware";

const router = new Router<unknown, Context>();
export default router;

router.get("/", bearerAuthMiddleware(), createController(deviceGetListController));

router.get(
  "/:id",
  paramsMiddleware,
  schemaMiddleware("data", deviceGetSchema),

  deviceEntityMiddleware("data.id"),

  bearerAuthMiddleware({
    fromPath: {
      subject: "entity.device.identityId",
    },
  }),

  createController(deviceGetController),
);

router.delete(
  "/:id",
  paramsMiddleware,
  schemaMiddleware("data", deviceRemoveSchema),

  deviceEntityMiddleware("data.id"),

  bearerAuthMiddleware({
    fromPath: {
      subject: "entity.device.identityId",
    },
  }),

  createController(deviceRemoveController),
);

router.put(
  "/:id/biometry",
  paramsMiddleware,
  schemaMiddleware("data", deviceUpdateBiometrySchema),

  challengeConfirmationTokenMiddleware("data.challengeConfirmationToken"),
  assertionMiddleware("data.id", "token.challengeConfirmationToken.claims.deviceId"),

  deviceEntityMiddleware("data.id"),

  bearerAuthMiddleware({
    fromPath: {
      subject: "entity.device.identityId",
    },
  }),

  createController(deviceUpdateBiometryController),
);

router.put(
  "/:id/pincode",
  paramsMiddleware,
  schemaMiddleware("data", deviceUpdatePincodeSchema),

  challengeConfirmationTokenMiddleware("data.challengeConfirmationToken"),
  assertionMiddleware("data.id", "token.challengeConfirmationToken.claims.deviceId"),

  deviceEntityMiddleware("data.id"),

  bearerAuthMiddleware({
    fromPath: {
      subject: "entity.device.identityId",
    },
  }),

  createController(deviceUpdatePincodeController),
);
