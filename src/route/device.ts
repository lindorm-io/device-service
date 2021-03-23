import { BEARER_AUTH_MW_OPTIONS } from "../config";
import { HttpStatus } from "@lindorm-io/core";
import { IKoaDeviceContext } from "../typing";
import { Router } from "@lindorm-io/koa";
import { bearerAuthMiddleware } from "@lindorm-io/koa-bearer-auth";
import { createDevice, removeDevice, updateDeviceName, updateDevicePIN, updateDeviceSecret } from "../action";
import { getDevices } from "../action/device/get-devices";

export const router = new Router();

router.use(bearerAuthMiddleware(BEARER_AUTH_MW_OPTIONS));

router.get(
  "/:id",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const accountId = ctx.params.id;

    ctx.body = await getDevices(ctx)({ accountId });
    ctx.status = HttpStatus.Success.OK;
  },
);

router.post(
  "/",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const { macAddress, name, pin, publicKey, secret, uniqueId } = ctx.request.body;

    ctx.body = await createDevice(ctx)({
      macAddress,
      name,
      pin,
      publicKey,
      secret,
      uniqueId,
    });
    ctx.status = HttpStatus.Success.CREATED;
  },
);

router.delete(
  "/:id",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    await removeDevice(ctx)({
      deviceId: ctx.params.id,
    });

    ctx.body = {};
    ctx.status = HttpStatus.Success.ACCEPTED;
  },
);

router.patch(
  "/:id/name",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const { name } = ctx.request.body;

    await updateDeviceName(ctx)({
      deviceId: ctx.params.id,
      name,
    });

    ctx.body = {};
    ctx.status = HttpStatus.Success.NO_CONTENT;
  },
);

router.patch(
  "/:id/pin",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const { pin, updatedPin } = ctx.request.body;

    await updateDevicePIN(ctx)({
      deviceId: ctx.params.id,
      pin,
      updatedPin,
    });

    ctx.body = {};
    ctx.status = HttpStatus.Success.NO_CONTENT;
  },
);

router.patch(
  "/:id/secret",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const { pin, updatedSecret } = ctx.request.body;

    await updateDeviceSecret(ctx)({
      deviceId: ctx.params.id,
      pin,
      updatedSecret,
    });

    ctx.body = {};
    ctx.status = HttpStatus.Success.NO_CONTENT;
  },
);
