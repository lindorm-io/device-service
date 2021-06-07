import { DeviceContext } from "../../typing";
import { DeviceController } from "../../controller";
import { HttpStatus } from "@lindorm-io/koa";
import { Router, controllerMiddleware } from "@lindorm-io/koa";
import { bearerAuthMiddleware } from "../../middleware";
import { router as changeRoute } from "./change";

export const router = new Router<unknown, DeviceContext>();

router.use(bearerAuthMiddleware);
router.use(controllerMiddleware(DeviceController));

router.use("/change", changeRoute.routes(), changeRoute.allowedMethods());

router.patch("/:id", async (ctx): Promise<void> => {
  const {
    controller: { deviceController },
  } = ctx;

  const { name } = ctx.request.body;

  await deviceController.updateName({
    deviceId: ctx.params.id,
    name,
  });

  ctx.status = HttpStatus.Success.ACCEPTED;
});

router.delete("/:id", async (ctx): Promise<void> => {
  const {
    controller: { deviceController },
  } = ctx;

  await deviceController.remove({
    deviceId: ctx.params.id,
  });

  ctx.status = HttpStatus.Success.ACCEPTED;
});
