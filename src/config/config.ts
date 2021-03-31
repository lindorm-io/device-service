import dotenv from "dotenv";
import { ConfigHandler } from "./ConfigHandler";
import { MongoConnectionType } from "@lindorm-io/mongo";
import { NodeEnvironment } from "@lindorm-io/koa-config";
import { RedisConnectionType } from "@lindorm-io/redis";
import { developmentConfig, environmentConfig, productionConfig, stagingConfig, testConfig } from "./files";

if (!process.env.NODE_ENV) dotenv.config();

const handler = new ConfigHandler({
  productionConfig,
  stagingConfig,
  developmentConfig,
  environmentConfig,
  testConfig,
});

export const { NODE_ENVIRONMENT } = environmentConfig;
export const IS_TEST = NODE_ENVIRONMENT === NodeEnvironment.TEST;
export const config = handler.get(process.env.NODE_ENV);

export const BASIC_AUTH_CLIENTS = {
  clients: [{ username: config.BASIC_AUTH_USERNAME, password: config.BASIC_AUTH_PASSWORD }],
};

export const REDIS_CONNECTION_OPTIONS = {
  type: RedisConnectionType.CACHE,
  port: config.REDIS_PORT,
};

export const MONGO_CONNECTION_OPTIONS = {
  type: MongoConnectionType.STORAGE,
  auth: {
    user: config.MONGO_INITDB_ROOT_USERNAME,
    password: config.MONGO_INITDB_ROOT_PASSWORD,
  },
  url: {
    host: config.MONGO_HOST,
    port: config.MONGO_EXPOSE_PORT,
  },
  databaseName: config.MONGO_DB_NAME,
};
