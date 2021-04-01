import { HttpStatus } from "@lindorm-io/core";
import { IKoaDeviceContext } from "../../typing";
import { Router } from "@lindorm-io/koa";
import { tokenValidationMiddleware } from "../../middleware";
import { updateDevicePIN, updateDeviceSecret } from "../../action";

export const router = new Router();

router.use(tokenValidationMiddleware);

router.patch(
  "/pin",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const { pin } = ctx.request.body;

    await updateDevicePIN(ctx)({ pin });

    ctx.body = {};
    ctx.status = HttpStatus.Success.ACCEPTED;
  },
);

router.patch(
  "/secret",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const { secret } = ctx.request.body;

    await updateDeviceSecret(ctx)({ secret });

    ctx.body = {};
    ctx.status = HttpStatus.Success.ACCEPTED;
  },
);
