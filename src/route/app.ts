import { HttpStatus } from "@lindorm-io/core";
import { IKoaDeviceContext } from "../typing";
import { Router } from "@lindorm-io/koa";

export const router = new Router();

router.get(
  "/",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    ctx.body = {};
    ctx.status = HttpStatus.ClientError.NOT_FOUND;
  },
);
