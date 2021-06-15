import { ChallengeSession, Device, EnrolmentSession } from "../entity";
import { ChallengeSessionCache, DeviceRepository, EnrolmentSessionCache } from "../infrastructure";
import { cacheEntityMiddleware } from "@lindorm-io/koa-redis";
import { repositoryEntityMiddleware } from "@lindorm-io/koa-mongo";
import { DeviceContext } from "../typing";
import { Middleware } from "@lindorm-io/koa";

export const challengeSessionEntityMiddleware = (path: string): Middleware<DeviceContext> =>
  cacheEntityMiddleware(path, ChallengeSession, ChallengeSessionCache);

export const deviceEntityMiddleware = (path: string): Middleware<DeviceContext> =>
  repositoryEntityMiddleware(path, Device, DeviceRepository);

export const enrolmentSessionEntityMiddleware = (path: string): Middleware<DeviceContext> =>
  cacheEntityMiddleware(path, EnrolmentSession, EnrolmentSessionCache);
