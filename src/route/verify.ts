import { BEARER_TOKEN_MW_OPTIONS } from "../config";
import { HttpStatus } from "@lindorm-io/core";
import { IKoaDeviceContext } from "../typing";
import { Router } from "@lindorm-io/koa";
import { bearerTokenMiddleware } from "@lindorm-io/koa-jwt";
import { deviceMiddleware } from "../middleware";
import { verifyDeviceChallenge, verifyDevicePIN, verifyDeviceSecret } from "../action";

export const router = new Router();

router.use(bearerTokenMiddleware(BEARER_TOKEN_MW_OPTIONS));
router.use(deviceMiddleware);

router.post(
  "/challenge",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const { challenge, verifier } = ctx.request.body;

    await verifyDeviceChallenge(ctx)({ challenge, verifier });

    ctx.body = {};
    ctx.status = HttpStatus.Success.NO_CONTENT;
  },
);

router.post(
  "/pin",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const { challenge, pin, verifier } = ctx.request.body;

    await verifyDevicePIN(ctx)({ challenge, pin, verifier });

    ctx.body = {};
    ctx.status = HttpStatus.Success.NO_CONTENT;
  },
);

router.post(
  "/secret",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const { challenge, secret, verifier } = ctx.request.body;

    await verifyDeviceSecret(ctx)({ challenge, secret, verifier });

    ctx.body = {};
    ctx.status = HttpStatus.Success.NO_CONTENT;
  },
);
