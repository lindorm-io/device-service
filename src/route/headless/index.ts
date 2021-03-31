import { BASIC_AUTH_CLIENTS } from "../../config";
import { Router } from "@lindorm-io/koa";
import { basicAuthMiddleware } from "@lindorm-io/koa-basic-auth";
import { router as challengeRoute } from "./challenge";

export const router = new Router();

router.use(basicAuthMiddleware(BASIC_AUTH_CLIENTS));

router.use("/challenge", challengeRoute.routes(), challengeRoute.allowedMethods());
