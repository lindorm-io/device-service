import { ConfigHandler } from "./ConfigHandler";
import { MongoConnectionOptions, MongoConnectionType } from "@lindorm-io/mongo";
import { NodeEnvironment } from "@lindorm-io/koa-config";
import { RedisConnectionOptions, RedisConnectionType } from "@lindorm-io/redis";
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

export const REDIS_CONNECTION_OPTIONS: RedisConnectionOptions = {
  host: config.REDIS_HOST,
  password: config.REDIS_PASSWORD,
  port: config.REDIS_PORT,
  type: RedisConnectionType.CACHE,
};

export const MONGO_CONNECTION_OPTIONS: MongoConnectionOptions = {
  auth: {
    user: config.MONGO_USERNAME,
    password: config.MONGO_PASSWORD,
  },
  databaseName: config.MONGO_DB_NAME,
  hostname: config.MONGO_HOST,
  port: config.MONGO_PORT,
  type: MongoConnectionType.STORAGE,
};
