import { Challenge, Device } from "../entity";
import { ChallengeCache, DeviceRepository } from "../infrastructure";
import { cacheEntityMiddleware } from "@lindorm-io/koa-redis";
import { repositoryEntityMiddleware } from "@lindorm-io/koa-mongo";

export const challengeEntityMiddleware = cacheEntityMiddleware("request.body.challengeId", Challenge, ChallengeCache);

export const deviceEntityMiddleware = repositoryEntityMiddleware("request.body.deviceId", Device, DeviceRepository);
