import { Configuration } from "../ConfigHandler";

export const developmentConfig: Configuration = {
  NODE_ENVIRONMENT: process.env.NODE_ENV,
  SERVER_PORT: 3003,
  HOST: "http://localhost",

  BASIC_AUTH_USERNAME: "secret",
  BASIC_AUTH_PASSWORD: "secret",

  AUTH_JWT_ISSUER: "https://dev.authentication.lindorm.io",
  AUTH_WEB_KEY_HOST: "http://localhost:3001",

  DEVICE_JWT_ISSUER: "https://dev.device.lindorm.io",

  CRYPTO_AES_SECRET: "secret",
  CRYPTO_SHA_SECRET: "secret",

  ENROLMENT_EXPIRY: "5 minutes",
  CHALLENGE_EXPIRY: "15 minutes",
  CHALLENGE_CONFIRMATION_EXPIRY: "10 minutes",

  REDIS_PORT: 6379,

  MONGO_INITDB_ROOT_USERNAME: "root",
  MONGO_INITDB_ROOT_PASSWORD: "example",
  MONGO_HOST: "localhost",
  MONGO_EXPOSE_PORT: 27017,
  MONGO_DB_NAME: "device",
};
