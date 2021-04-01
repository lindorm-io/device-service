import { ChallengeStrategy } from "../../enum";
import { HttpStatus } from "@lindorm-io/core";
import { IKoaDeviceContext } from "../../typing";
import { Router } from "@lindorm-io/koa";
import { challengeMiddleware, deviceMiddleware } from "../../middleware";
import {
  verifyChallengeImplicit,
  verifyChallengeWithPin,
  verifyChallengeWithRecoveryKey,
  verifyChallengeWithSecret,
} from "../../action";

export const router = new Router();

router.use(deviceMiddleware);
router.use(challengeMiddleware);

router.post(
  "/",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const { certificateVerifier, pin, recoveryKey, secret, strategy } = ctx.request.body;

    switch (strategy) {
      case ChallengeStrategy.IMPLICIT:
        ctx.body = await verifyChallengeImplicit(ctx)({
          certificateVerifier,
          strategy,
        });
        break;

      case ChallengeStrategy.PIN:
        ctx.body = await verifyChallengeWithPin(ctx)({
          certificateVerifier,
          pin,
          strategy,
        });
        break;

      case ChallengeStrategy.RECOVERY:
        ctx.body = await verifyChallengeWithRecoveryKey(ctx)({
          certificateVerifier,
          recoveryKey,
          strategy,
        });
        break;

      case ChallengeStrategy.SECRET:
        ctx.body = await verifyChallengeWithSecret(ctx)({
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
