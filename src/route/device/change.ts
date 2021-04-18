import { HttpStatus } from "@lindorm-io/core";
import { IKoaDeviceContext } from "../../typing";
import { Router } from "@lindorm-io/koa";
import { tokenValidationMiddleware } from "../../middleware";
import { generateNewRecoveryKey, updateDevicePIN, updateDeviceSecret } from "../../action";

export const router = new Router();

router.use(tokenValidationMiddleware);

router.patch(
  "/pin",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const { pin } = ctx.request.body;

    await updateDevicePIN(ctx)({ pin });

    ctx.status = HttpStatus.Success.ACCEPTED;
  },
);

router.patch(
  "/recovery-key",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    ctx.body = await generateNewRecoveryKey(ctx)();

    ctx.status = HttpStatus.Success.OK;
  },
);

router.patch(
  "/secret",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const { secret } = ctx.request.body;

    await updateDeviceSecret(ctx)({ secret });

    ctx.status = HttpStatus.Success.ACCEPTED;
  },
);
