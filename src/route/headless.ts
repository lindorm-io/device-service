import { BASIC_AUTH_MW_OPTIONS } from "../config";
import { HttpStatus } from "@lindorm-io/core";
import { IKoaDeviceContext } from "../typing";
import { Router } from "@lindorm-io/koa";
import { basicAuthMiddleware } from "@lindorm-io/koa-basic-auth";
import { deviceMiddleware } from "../middleware";
import { verifyDeviceChallenge, verifyDevicePIN, verifyDeviceSecret } from "../action";

export const router = new Router();

router.use(basicAuthMiddleware(BASIC_AUTH_MW_OPTIONS));
router.use(deviceMiddleware);

router.post(
  "/verify-challenge",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const { deviceChallenge, deviceVerifier } = ctx.request.body;

    await verifyDeviceChallenge(ctx)({ deviceChallenge, deviceVerifier });

    ctx.body = {};
    ctx.status = HttpStatus.Success.NO_CONTENT;
  },
);

router.post(
  "/verify-pin",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const { deviceChallenge, deviceVerifier, pin } = ctx.request.body;

    await verifyDevicePIN(ctx)({ deviceChallenge, deviceVerifier, pin });

    ctx.body = {};
    ctx.status = HttpStatus.Success.NO_CONTENT;
  },
);

router.post(
  "/verify-secret",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const { deviceChallenge, deviceVerifier, secret } = ctx.request.body;

    await verifyDeviceSecret(ctx)({ deviceChallenge, deviceVerifier, secret });

    ctx.body = {};
    ctx.status = HttpStatus.Success.NO_CONTENT;
  },
);
