import { HttpStatus } from "@lindorm-io/core";
import { IKoaDeviceContext } from "../../typing";
import { Router } from "@lindorm-io/koa";
import { bearerAuthMiddleware } from "../../middleware";
import { removeDevice, updateDeviceName } from "../../action";
import { router as changeRoute } from "./change";

export const router = new Router();

router.use(bearerAuthMiddleware);

router.use("/change", changeRoute.routes(), changeRoute.allowedMethods());

router.patch(
  "/:id",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const { name } = ctx.request.body;

    await updateDeviceName(ctx)({
      deviceId: ctx.params.id,
      name,
    });

    ctx.body = {};
    ctx.status = HttpStatus.Success.ACCEPTED;
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
