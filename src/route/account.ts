import { HttpStatus } from "@lindorm-io/core";
import { IKoaDeviceContext } from "../typing";
import { Router } from "@lindorm-io/koa";
import { bearerAuthMiddleware } from "../middleware";
import { getDevices } from "../action";

export const router = new Router();

router.use(bearerAuthMiddleware);

router.get(
  "/:id",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const accountId = ctx.params.id;

    ctx.body = await getDevices(ctx)({ accountId });
    ctx.status = HttpStatus.Success.OK;
  },
);
