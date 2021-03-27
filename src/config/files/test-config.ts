import { IConfigurationData } from "../ConfigHandler";

export const testConfig: IConfigurationData = {
  NODE_ENVIRONMENT: process.env.NODE_ENV,
  SERVER_PORT: 3001,
  HOST: "https://test.device.lindorm.io",

  BASIC_AUTH_USERNAME: "secret",
  BASIC_AUTH_PASSWORD: "secret",

  JWT_ISSUER: "https://test.authentication.lindorm.io",

  WEB_KEY_HOST: "https://test.authentication.lindorm.io",

  CRYPTO_AES_SECRET: "secret",
  CRYPTO_SHA_SECRET: "secret",

  ENROLMENT_EXPIRY: "5 minutes",
  CHALLENGE_EXPIRY: "15 minutes",

  REDIS_PORT: 6379,

  MONGO_INITDB_ROOT_USERNAME: "root",
  MONGO_INITDB_ROOT_PASSWORD: "password",
  MONGO_HOST: "localhost",
  MONGO_EXPOSE_PORT: 27017,
  MONGO_DB_NAME: "device",
};
