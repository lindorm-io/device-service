import { ChallengeSession, Device, EnrolmentSession } from "../entity";
import { cacheEntityMiddleware } from "@lindorm-io/koa-redis";
import { repositoryEntityMiddleware } from "@lindorm-io/koa-mongo";
import {
  ChallengeSessionCache,
  DeviceRepository,
  EnrolmentSessionCache,
} from "../infrastructure";

export const challengeSessionEntityMiddleware = cacheEntityMiddleware(
  ChallengeSession,
  ChallengeSessionCache,
);

export const deviceEntityMiddleware = repositoryEntityMiddleware(
  Device,
  DeviceRepository,
);

export const enrolmentSessionEntityMiddleware = cacheEntityMiddleware(
  EnrolmentSession,
  EnrolmentSessionCache,
);
