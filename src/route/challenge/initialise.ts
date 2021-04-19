import { ChallengeController } from "../../controller";
import { ChallengeHandler, DeviceHandler } from "../../handler";
import { HttpStatus } from "@lindorm-io/core";
import { IKoaDeviceContext } from "../../typing";
import { Router } from "@lindorm-io/koa";
import { controllerMiddleware, handlerMiddleware } from "@lindorm-io/koa/dist/middleware";
import { deviceMiddleware } from "../../middleware";

export const router = new Router();

router.use(deviceMiddleware);

router.use(handlerMiddleware(ChallengeHandler));
router.use(handlerMiddleware(DeviceHandler));
router.use(controllerMiddleware(ChallengeController));

router.post(
  "/",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const {
      controller: { challengeController },
    } = ctx;

    const { scope, strategy } = ctx.request.body;

    ctx.body = await challengeController.initialise({ scope, strategy });
    ctx.status = HttpStatus.Success.CREATED;
  },
);
