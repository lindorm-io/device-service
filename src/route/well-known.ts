import { DeviceContext } from "../typing";
import { HttpStatus } from "@lindorm-io/koa";
import { Router } from "@lindorm-io/koa";

export const router = new Router<unknown, DeviceContext>();

router.get("/jwks.json", async (ctx: DeviceContext): Promise<void> => {
  ctx.body = { keys: ctx.keystore.getJWKS() };
  ctx.status = HttpStatus.Success.OK;
});
