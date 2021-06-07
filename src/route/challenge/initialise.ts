import { ChallengeController } from "../../controller";
import { DeviceContext } from "../../typing";
import { HttpStatus } from "@lindorm-io/koa";
import { Router, controllerMiddleware } from "@lindorm-io/koa";
import { deviceEntityMiddleware, deviceValidationMiddleware } from "../../middleware";

export const router = new Router<unknown, DeviceContext>();

router.use(deviceEntityMiddleware);
router.use(deviceValidationMiddleware);
router.use(controllerMiddleware(ChallengeController));

router.post("/", async (ctx): Promise<void> => {
  const {
    controller: { challengeController },
  } = ctx;

  const { scope, strategy } = ctx.request.body;

  ctx.body = await challengeController.initialise({ scope, strategy });
  ctx.status = HttpStatus.Success.CREATED;
});
