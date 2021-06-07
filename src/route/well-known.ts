import { DeviceContext } from "../typing";
import { HttpStatus } from "@lindorm-io/koa";
import { Router } from "@lindorm-io/koa";
import { snakeKeys } from "@lindorm-io/core";

export const router = new Router<unknown, DeviceContext>();

router.get("/jwks.json", async (ctx): Promise<void> => {
  ctx.body = { keys: ctx.keystore.getJWKS().map((jwk) => snakeKeys(jwk)) };
  ctx.status = HttpStatus.Success.OK;
});
