import { HttpStatus } from "@lindorm-io/core";
import { IKoaDeviceContext } from "../typing";
import { Router } from "@lindorm-io/koa";
import { getUnixTime } from "date-fns";

export const router = new Router();

router.get(
  "/jwks.json",
  async (ctx: IKoaDeviceContext): Promise<void> => {
    const usableKeys = ctx.keystore.device.getUsableKeys();
    const keys: Array<any> = [];

    for (const key of usableKeys) {
      keys.push({
        alg: key.algorithm,
        c: getUnixTime(key.created),
        e: "AQAB",
        exp: key.expires,
        kid: key.id,
        kty: key.type,
        n: key.publicKey,
        use: "sig",
      });
    }

    ctx.body = { keys };
    ctx.status = HttpStatus.Success.OK;
  },
);
