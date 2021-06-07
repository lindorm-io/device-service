import { DeviceRepository } from "../infrastructure";
import { repositoryMiddleware } from "@lindorm-io/koa-mongo";
import { KeyPairRepository } from "@lindorm-io/koa-keystore";

export const deviceRepositoryMiddleware = repositoryMiddleware(DeviceRepository);

export const keyPairRepositoryMiddleware = repositoryMiddleware(KeyPairRepository);
