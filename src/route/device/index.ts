import { AuthTokenHandler, DeviceHandler } from "../../handler";
import { DeviceController } from "../../controller";
import { HttpStatus } from "@lindorm-io/core";
import { IKoaDeviceContext } from "../../typing";
import { Router } from "@lindorm-io/koa";
import { bearerAuthMiddleware } from "../../middleware";
import { controllerMiddleware, handlerMiddleware } from "@lindorm-io/koa/dist/middleware";
import { router as changeRoute } from "./change";

export const router = new Router();

router.use(bearerAuthMiddleware);
router.use(handlerMiddleware(AuthTokenHandler));
router.use(handlerMiddleware(DeviceHandler));
router.use(controllerMiddleware(DeviceController));

router.use("/change", changeRoute.routes(), changeRoute.allowedMethods());

router.patch(
  "/:id",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const {
      controller: { deviceController },
    } = ctx;

    const { name } = ctx.request.body;

    await deviceController.updateName({
      deviceId: ctx.params.id,
      name,
    });

    ctx.status = HttpStatus.Success.ACCEPTED;
  },
);

router.delete(
  "/:id",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const {
      controller: { deviceController },
    } = ctx;

    await deviceController.remove({
      deviceId: ctx.params.id,
    });

    ctx.status = HttpStatus.Success.ACCEPTED;
  },
);
