import { ConfigHandler } from "./ConfigHandler";
import { NodeEnvironment } from "@lindorm-io/koa-config";
import {
  developmentConfig,
  environmentConfig,
  productionConfig,
  stagingConfig,
  testConfig,
} from "./files";

const handler = new ConfigHandler({
  productionConfig,
  stagingConfig,
  developmentConfig,
  environmentConfig,
  testConfig,
});

export const { NODE_ENVIRONMENT } = environmentConfig;
export const IS_TEST = NODE_ENVIRONMENT === NodeEnvironment.TEST;
export const config = handler.get(NODE_ENVIRONMENT);

export const BASIC_AUTH_CLIENTS = {
  clients: [
    { username: config.BASIC_AUTH_USERNAME, password: config.BASIC_AUTH_PASSWORD },
  ],
};
