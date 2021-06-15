import { DeviceRepository } from "../infrastructure";
import { KeyPairRepository } from "@lindorm-io/koa-keystore";
import { repositoryMiddleware } from "@lindorm-io/koa-mongo";

export const deviceRepositoryMiddleware = repositoryMiddleware(DeviceRepository);

export const keyPairRepositoryMiddleware = repositoryMiddleware(KeyPairRepository);
