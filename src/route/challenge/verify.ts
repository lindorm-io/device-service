import { ChallengeController } from "../../controller";
import { ChallengeHandler, DeviceHandler } from "../../handler";
import { ChallengeStrategy } from "../../enum";
import { HttpStatus } from "@lindorm-io/core";
import { IKoaDeviceContext } from "../../typing";
import { Router, controllerMiddleware, handlerMiddleware } from "@lindorm-io/koa";
import { challengeMiddleware, deviceMiddleware } from "../../middleware";

export const router = new Router();

router.use(deviceMiddleware);
router.use(challengeMiddleware);
router.use(handlerMiddleware(ChallengeHandler));
router.use(handlerMiddleware(DeviceHandler));
router.use(controllerMiddleware(ChallengeController));

router.post(
  "/",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const {
      controller: { challengeController },
    } = ctx;

    const { certificateVerifier, pin, recoveryKey, secret, strategy } = ctx.request.body;

    switch (strategy) {
      case ChallengeStrategy.IMPLICIT:
        ctx.body = await challengeController.verifyImplicit({
          certificateVerifier,
          strategy,
        });
        break;

      case ChallengeStrategy.PIN:
        ctx.body = await challengeController.verifyPin({
          certificateVerifier,
          pin,
          strategy,
        });
        break;

      case ChallengeStrategy.RECOVERY:
        ctx.body = await challengeController.verifyRecoveryKey({
          certificateVerifier,
          recoveryKey,
          strategy,
        });
        break;

      case ChallengeStrategy.SECRET:
        ctx.body = await challengeController.verifySecret({
          certificateVerifier,
          secret,
          strategy,
        });
        break;

      default:
        throw new Error("unsupported strategy");
    }

    ctx.status = HttpStatus.Success.OK;
  },
);
