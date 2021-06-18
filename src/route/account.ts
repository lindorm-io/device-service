import { DeviceContext } from "../typing";
import { Router } from "@lindorm-io/koa";
import { Scope } from "../enum";
import { accountListDevices } from "../controller";
import { bearerAuthMiddleware } from "../middleware";
import { createController } from "@lindorm-io/koa";

export const router = new Router<unknown, DeviceContext>();

router.use(bearerAuthMiddleware([Scope.DEFAULT]));

router.get("/devices", createController(accountListDevices));
