import { AccountController } from "../controller";
import { AuthTokenHandler } from "../handler";
import { HttpStatus } from "@lindorm-io/core";
import { IKoaDeviceContext } from "../typing";
import { Router } from "@lindorm-io/koa";
import { bearerAuthMiddleware } from "../middleware";
import { controllerMiddleware, handlerMiddleware } from "@lindorm-io/koa/dist/middleware";

export const router = new Router();

router.use(bearerAuthMiddleware);
router.use(handlerMiddleware(AuthTokenHandler));
router.use(controllerMiddleware(AccountController));

router.get(
  "/:id",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const {
      controller: { accountController },
    } = ctx;

    const accountId = ctx.params.id;

    ctx.body = await accountController.getDevices({ accountId });
    ctx.status = HttpStatus.Success.OK;
  },
);
