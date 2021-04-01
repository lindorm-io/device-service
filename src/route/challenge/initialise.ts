import { HttpStatus } from "@lindorm-io/core";
import { IKoaDeviceContext } from "../../typing";
import { Router } from "@lindorm-io/koa";
import { deviceMiddleware } from "../../middleware";
import { initialiseChallenge } from "../../action";

export const router = new Router();

router.use(deviceMiddleware);

router.post(
  "/",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const { scope, strategy } = ctx.request.body;

    ctx.body = await initialiseChallenge(ctx)({ scope, strategy });
    ctx.status = HttpStatus.Success.CREATED;
  },
);
