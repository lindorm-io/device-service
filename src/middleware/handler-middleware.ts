import { AuthTokenHandler, ChallengeHandler, DeviceHandler, EnrolmentHandler } from "../handler";
import { handlerMiddleware } from "@lindorm-io/koa/dist/middleware";

export const authTokenHandlerMiddleware = handlerMiddleware(AuthTokenHandler);

export const challengeHandlerMiddleware = handlerMiddleware(ChallengeHandler);

export const deviceHandlerMiddleware = handlerMiddleware(DeviceHandler);

export const enrolmentHandlerMiddleware = handlerMiddleware(EnrolmentHandler);
