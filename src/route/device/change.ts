import { AuthTokenHandler, DeviceHandler } from "../../handler";
import { DeviceController } from "../../controller";
import { HttpStatus } from "@lindorm-io/core";
import { IKoaDeviceContext } from "../../typing";
import { Router } from "@lindorm-io/koa";
import { controllerMiddleware, handlerMiddleware } from "@lindorm-io/koa/dist/middleware";
import { tokenValidationMiddleware } from "../../middleware";

export const router = new Router();

router.use(tokenValidationMiddleware);
router.use(handlerMiddleware(AuthTokenHandler));
router.use(handlerMiddleware(DeviceHandler));
router.use(controllerMiddleware(DeviceController));

router.patch(
  "/pin",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const {
      controller: { deviceController },
    } = ctx;

    const { pin } = ctx.request.body;

    await deviceController.updatePin({ pin });

    ctx.status = HttpStatus.Success.ACCEPTED;
  },
);

router.patch(
  "/recovery-key",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const {
      controller: { deviceController },
    } = ctx;

    ctx.body = await deviceController.generateRecoveryKey();

    ctx.status = HttpStatus.Success.OK;
  },
);

router.patch(
  "/secret",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const {
      controller: { deviceController },
    } = ctx;

    const { secret } = ctx.request.body;

    await deviceController.updateSecret({ secret });

    ctx.status = HttpStatus.Success.ACCEPTED;
  },
);
