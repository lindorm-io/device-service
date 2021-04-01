import { ChallengeStrategy } from "../../enum";
import { HttpStatus } from "@lindorm-io/core";
import { IKoaDeviceContext } from "../../typing";
import { Router } from "@lindorm-io/koa";
import { deviceMiddleware } from "../../middleware";
import {
  initialiseChallenge,
  verifyChallengeImplicit,
  verifyChallengeWithPin,
  verifyChallengeWithSecret,
} from "../../action";

export const router = new Router();

router.use(deviceMiddleware);

router.post(
  "/",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const { certificateVerifier, challengeId, pin, secret, strategy } = ctx.request.body;

    switch (strategy) {
      case ChallengeStrategy.IMPLICIT:
        ctx.body = await verifyChallengeImplicit(ctx)({
          certificateVerifier,
          challengeId,
          strategy,
        });
        break;

      case ChallengeStrategy.PIN:
        ctx.body = await verifyChallengeWithPin(ctx)({
          certificateVerifier,
          challengeId,
          pin,
          strategy,
        });
        break;

      case ChallengeStrategy.SECRET:
        ctx.body = await verifyChallengeWithSecret(ctx)({
          certificateVerifier,
          challengeId,
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
