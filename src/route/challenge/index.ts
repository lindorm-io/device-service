import { BASIC_AUTH_CLIENTS } from "../../config";
import { Router } from "@lindorm-io/koa";
import { basicAuthMiddleware } from "@lindorm-io/koa-basic-auth";
import { router as initialiseRoute } from "./initialise";
import { router as verifyRoute } from "./verify";

export const router = new Router();

router.use(basicAuthMiddleware(BASIC_AUTH_CLIENTS));

router.use("/initialise", initialiseRoute.routes(), initialiseRoute.allowedMethods());
router.use("/verify", verifyRoute.routes(), verifyRoute.allowedMethods());
