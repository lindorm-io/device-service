import { DeviceContext } from "../../typing";
import { DeviceController } from "../../controller";
import { HttpStatus } from "@lindorm-io/koa";
import { Router, controllerMiddleware } from "@lindorm-io/koa";
import { challengeConfirmationTokenMiddleware } from "../../middleware";

export const router = new Router<unknown, DeviceContext>();

router.use(challengeConfirmationTokenMiddleware);
// router.use(deviceEntityMiddleware);
router.use(controllerMiddleware(DeviceController));

router.patch("/pin", async (ctx): Promise<void> => {
  const {
    controller: { deviceController },
  } = ctx;

  const { deviceId, pin } = ctx.request.body;

  await deviceController.updatePin({ deviceId, pin });

  ctx.status = HttpStatus.Success.ACCEPTED;
});

router.patch("/recovery-key", async (ctx): Promise<void> => {
  const {
    controller: { deviceController },
  } = ctx;

  const { deviceId } = ctx.request.body;

  ctx.body = await deviceController.generateRecoveryKey({ deviceId });

  ctx.status = HttpStatus.Success.OK;
});

router.patch("/secret", async (ctx): Promise<void> => {
  const {
    controller: { deviceController },
  } = ctx;

  const { deviceId, secret } = ctx.request.body;

  await deviceController.updateSecret({ deviceId, secret });

  ctx.status = HttpStatus.Success.ACCEPTED;
});
