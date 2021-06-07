import { ChallengeController } from "../../controller";
import { ChallengeStrategy } from "../../enum";
import { DeviceContext } from "../../typing";
import { Router, controllerMiddleware } from "@lindorm-io/koa";
import {
  challengeEntityMiddleware,
  challengeValidationMiddleware,
  deviceEntityMiddleware,
  deviceValidationMiddleware,
} from "../../middleware";
import { HttpStatus } from "@lindorm-io/koa";

export const router = new Router<unknown, DeviceContext>();

router.use(deviceEntityMiddleware);
router.use(challengeEntityMiddleware);
router.use(deviceValidationMiddleware);
router.use(challengeValidationMiddleware);
router.use(controllerMiddleware(ChallengeController));

router.post("/", async (ctx): Promise<void> => {
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
});
