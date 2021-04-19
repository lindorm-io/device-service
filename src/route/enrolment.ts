import { DeviceHandler, EnrolmentHandler } from "../handler";
import { EnrolmentController } from "../controller";
import { HttpStatus } from "@lindorm-io/core";
import { IKoaDeviceContext } from "../typing";
import { Router, controllerMiddleware, handlerMiddleware } from "@lindorm-io/koa";
import { bearerAuthMiddleware } from "../middleware";

export const router = new Router();

router.use(bearerAuthMiddleware);
router.use(handlerMiddleware(EnrolmentHandler));
router.use(handlerMiddleware(DeviceHandler));
router.use(controllerMiddleware(EnrolmentController));

router.post(
  "/initialise",
  async (ctx: IKoaDeviceContext): Promise<void> => {
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
  },
);

router.post(
  "/verify",
  async (ctx: IKoaDeviceContext): Promise<void> => {
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
  },
);
