import { DeviceContext } from "../typing";
import { Router, schemaMiddleware } from "@lindorm-io/koa";
import { Scope } from "../enum";
import { bearerAuthMiddleware, challengeConfirmationTokenMiddleware, deviceEntityMiddleware } from "../middleware";
import { createController } from "@lindorm-io/koa";
import {
  deviceRemove,
  deviceRemoveSchema,
  deviceUpdateName,
  deviceUpdateNameSchema,
  deviceUpdatePincode,
  deviceUpdatePincodeSchema,
  deviceUpdateRecoveryKey,
  deviceUpdateRecoveryKeySchema,
  deviceUpdateSecret,
  deviceUpdateSecretSchema,
} from "../controller";

export const router = new Router<unknown, DeviceContext>();

router.use(bearerAuthMiddleware([Scope.DEFAULT, Scope.EDIT]));

router.delete(
  "/",
  schemaMiddleware("request.body", deviceRemoveSchema),
  deviceEntityMiddleware("request.body.deviceId"),
  createController(deviceRemove),
);

router.patch(
  "/name",
  schemaMiddleware("request.body", deviceUpdateNameSchema),
  deviceEntityMiddleware("request.body.deviceId"),
  createController(deviceUpdateName),
);

router.patch(
  "/pincode",
  schemaMiddleware("request.body", deviceUpdatePincodeSchema),
  challengeConfirmationTokenMiddleware("request.body.challengeConfirmationToken"),
  deviceEntityMiddleware("token.challengeConfirmationToken.deviceId"),
  createController(deviceUpdatePincode),
);

router.patch(
  "/recovery-key",
  schemaMiddleware("request.body", deviceUpdateRecoveryKeySchema),
  challengeConfirmationTokenMiddleware("request.body.challengeConfirmationToken"),
  deviceEntityMiddleware("token.challengeConfirmationToken.deviceId"),
  createController(deviceUpdateRecoveryKey),
);

router.patch(
  "/secret",
  schemaMiddleware("request.body", deviceUpdateSecretSchema),
  challengeConfirmationTokenMiddleware("request.body.challengeConfirmationToken"),
  deviceEntityMiddleware("token.challengeConfirmationToken.deviceId"),
  createController(deviceUpdateSecret),
);
