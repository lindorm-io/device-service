import { Context } from "../../typing";
import {
  Router,
  paramsMiddleware,
  useAssertion,
  useController,
  useSchema,
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
  deviceUpdateTrustedController,
  deviceUpdateTrustedSchema,
} from "../../controller";
import {
  bearerAuthMiddleware,
  challengeConfirmationTokenMiddleware,
  deviceEntityMiddleware,
} from "../../middleware";

const router = new Router<unknown, Context>();
export default router;

router.get("/", bearerAuthMiddleware(), useController(deviceGetListController));

router.get(
  "/:id",
  paramsMiddleware,
  useSchema(deviceGetSchema),

  deviceEntityMiddleware("data.id"),

  bearerAuthMiddleware({
    fromPath: {
      subject: "entity.device.identityId",
    },
  }),

  useController(deviceGetController),
);

router.delete(
  "/:id",
  paramsMiddleware,
  useSchema(deviceRemoveSchema),

  deviceEntityMiddleware("data.id"),

  bearerAuthMiddleware({
    fromPath: {
      subject: "entity.device.identityId",
    },
  }),

  useController(deviceRemoveController),
);

router.put(
  "/:id/biometry",
  paramsMiddleware,
  useSchema(deviceUpdateBiometrySchema),

  challengeConfirmationTokenMiddleware("data.challengeConfirmationToken"),
  useAssertion({
    fromPath: {
      expect: "data.id",
      actual: "token.challengeConfirmationToken.claims.deviceId",
    },
  }),

  deviceEntityMiddleware("data.id"),

  bearerAuthMiddleware({
    fromPath: {
      subject: "entity.device.identityId",
    },
  }),

  useController(deviceUpdateBiometryController),
);

router.put(
  "/:id/pincode",
  paramsMiddleware,
  useSchema(deviceUpdatePincodeSchema),

  challengeConfirmationTokenMiddleware("data.challengeConfirmationToken"),
  useAssertion({
    fromPath: {
      expect: "data.id",
      actual: "token.challengeConfirmationToken.claims.deviceId",
    },
  }),

  deviceEntityMiddleware("data.id"),

  bearerAuthMiddleware({
    fromPath: {
      subject: "entity.device.identityId",
    },
  }),

  useController(deviceUpdatePincodeController),
);

router.put(
  "/:id/trusted",
  paramsMiddleware,
  useSchema(deviceUpdateTrustedSchema),

  challengeConfirmationTokenMiddleware("data.challengeConfirmationToken"),
  deviceEntityMiddleware("data.id"),
  useAssertion({
    expect: false,
    fromPath: {
      actual: "entity.device.trusted",
    },
  }),

  bearerAuthMiddleware({
    fromPath: {
      subject: "entity.device.identityId",
    },
  }),

  useController(deviceUpdateTrustedController),
);
