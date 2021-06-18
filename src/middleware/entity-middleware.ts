import { ChallengeSession, Device, EnrolmentSession } from "../entity";
import { ChallengeSessionCache, DeviceRepository, EnrolmentSessionCache } from "../infrastructure";
import { cacheEntityMiddleware } from "@lindorm-io/koa-redis";
import { repositoryEntityMiddleware } from "@lindorm-io/koa-mongo";

export const challengeSessionEntityMiddleware = cacheEntityMiddleware(ChallengeSession, ChallengeSessionCache);

export const deviceEntityMiddleware = repositoryEntityMiddleware(Device, DeviceRepository);

export const enrolmentSessionEntityMiddleware = cacheEntityMiddleware(EnrolmentSession, EnrolmentSessionCache);
