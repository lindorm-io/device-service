import { DeviceRepository } from "../infrastructure";
import { repositoryMiddleware } from "@lindorm-io/koa-mongo";

export const deviceRepositoryMiddleware = repositoryMiddleware(DeviceRepository);
