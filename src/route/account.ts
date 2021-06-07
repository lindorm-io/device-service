import { AccountController } from "../controller";
import { DeviceContext } from "../typing";
import { HttpStatus } from "@lindorm-io/koa";
import { Router, controllerMiddleware } from "@lindorm-io/koa";
import { bearerAuthMiddleware } from "../middleware";

export const router = new Router<unknown, DeviceContext>();

router.use(bearerAuthMiddleware);
router.use(controllerMiddleware(AccountController));

router.get("/:id", async (ctx): Promise<void> => {
  const {
    controller: { accountController },
  } = ctx;

  const accountId = ctx.params.id;

  ctx.body = await accountController.getDevices({ accountId });
  ctx.status = HttpStatus.Success.OK;
});
