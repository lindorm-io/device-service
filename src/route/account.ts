import { DeviceContext } from "../typing";
import { Router } from "@lindorm-io/koa";
import { bearerAuthMiddleware } from "../middleware";
import { createController } from "@lindorm-io/koa";
import { accountListDevices } from "../controller";

export const router = new Router<unknown, DeviceContext>();

router.use(bearerAuthMiddleware);

router.get("/devices", createController(accountListDevices));
