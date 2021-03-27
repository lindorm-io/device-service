import { IConfigurationData } from "../ConfigHandler";

export const developmentConfig: IConfigurationData = {
  NODE_ENVIRONMENT: process.env.NODE_ENV,
  SERVER_PORT: 3003,
  HOST: "http://localhost",

  BASIC_AUTH_USERNAME: "secret",
  BASIC_AUTH_PASSWORD: "secret",

  JWT_ISSUER: "https://dev.authentication.lindorm.io",

  WEB_KEY_HOST: "http://localhost:3001",

  CRYPTO_AES_SECRET: "secret",
  CRYPTO_SHA_SECRET: "secret",

  ENROLMENT_EXPIRY: "5 minutes",
  CHALLENGE_EXPIRY: "15 minutes",

  REDIS_PORT: 6379,

  MONGO_INITDB_ROOT_USERNAME: "root",
  MONGO_INITDB_ROOT_PASSWORD: "example",
  MONGO_HOST: "localhost",
  MONGO_EXPOSE_PORT: 27017,
  MONGO_DB_NAME: "device",
};
