import { BASIC_AUTH_MW_OPTIONS } from "../../config";
import { HttpStatus } from "@lindorm-io/core";
import { IKoaDeviceContext } from "../../typing";
import { Router } from "@lindorm-io/koa";
import { basicAuthMiddleware } from "@lindorm-io/koa-basic-auth";
import { router as challengeRoute } from "./challenge";

export const router = new Router();

router.use(basicAuthMiddleware(BASIC_AUTH_MW_OPTIONS));

router.use("/challenge", challengeRoute.routes(), challengeRoute.allowedMethods());

router.get(
  "/",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    ctx.body = {};
    ctx.status = HttpStatus.ClientError.NOT_FOUND;
  },
);
