import { DeviceContext } from "../typing";
import { EnrolmentController } from "../controller";
import { HttpStatus } from "@lindorm-io/koa";
import { Router, controllerMiddleware } from "@lindorm-io/koa";
import { bearerAuthMiddleware } from "../middleware";

export const router = new Router<unknown, DeviceContext>();

router.use(bearerAuthMiddleware);
router.use(controllerMiddleware(EnrolmentController));

router.post("/initialise", async (ctx: DeviceContext): Promise<void> => {
  const {
    controller: { enrolmentController },
  } = ctx;

  const { macAddress, name, publicKey, uniqueId } = ctx.request.body;

  ctx.body = await enrolmentController.initialise({
    macAddress,
    name,
    publicKey,
    uniqueId,
  });
  ctx.status = HttpStatus.Success.CREATED;
});

router.post("/verify", async (ctx): Promise<void> => {
  const {
    controller: { enrolmentController },
  } = ctx;

  const { certificateVerifier, enrolmentId, pin, secret } = ctx.request.body;

  ctx.body = await enrolmentController.verify({
    certificateVerifier,
    enrolmentId,
    pin,
    secret,
  });
  ctx.status = HttpStatus.Success.CREATED;
});
