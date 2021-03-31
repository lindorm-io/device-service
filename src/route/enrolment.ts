import { HttpStatus } from "@lindorm-io/core";
import { IKoaDeviceContext } from "../typing";
import { Router } from "@lindorm-io/koa";
import { concludeEnrolment, initialiseEnrolment } from "../action";
import { bearerAuthMiddleware } from "../middleware";

export const router = new Router();

router.use(bearerAuthMiddleware);

router.post(
  "/initialise",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const { macAddress, name, publicKey, uniqueId } = ctx.request.body;

    ctx.body = await initialiseEnrolment(ctx)({
      macAddress,
      name,
      publicKey,
      uniqueId,
    });
    ctx.status = HttpStatus.Success.CREATED;
  },
);

router.post(
  "/conclude",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const { certificateVerifier, enrolmentId, pin, secret } = ctx.request.body;

    ctx.body = await concludeEnrolment(ctx)({
      certificateVerifier,
      enrolmentId,
      pin,
      secret,
    });
    ctx.status = HttpStatus.Success.CREATED;
  },
);
