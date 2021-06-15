import { ChallengeSession, Device, EnrolmentSession } from "../entity";
import { ChallengeSessionCache, DeviceRepository, EnrolmentSessionCache } from "../infrastructure";
import { cacheEntityMiddleware } from "@lindorm-io/koa-redis";
import { repositoryEntityMiddleware } from "@lindorm-io/koa-mongo";

export const challengeSessionEntityMiddleware = (path: string) =>
  cacheEntityMiddleware(path, ChallengeSession, ChallengeSessionCache);

export const deviceEntityMiddleware = (path: string) => repositoryEntityMiddleware(path, Device, DeviceRepository);

export const enrolmentSessionEntityMiddleware = (path: string) =>
  cacheEntityMiddleware(path, EnrolmentSession, EnrolmentSessionCache);
