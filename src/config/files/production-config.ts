import { Configuration } from "../ConfigHandler";

export const productionConfig: Configuration = {
  NODE_ENVIRONMENT: process.env.NODE_ENV,
  SERVER_PORT: 3000,
  HOST: "http://device.lindorm.io",

  BASIC_AUTH_USERNAME: null,
  BASIC_AUTH_PASSWORD: null,

  AUTH_JWT_ISSUER: "https://authentication.lindorm.io",
  AUTH_WEB_KEY_HOST: "https://authentication.lindorm.io",

  DEVICE_JWT_ISSUER: "https://device.lindorm.io",

  CRYPTO_AES_SECRET: null,
  CRYPTO_SHA_SECRET: null,

  ENROLMENT_CONFIRMATION_EXPIRY: "10 minutes",
  ENROLMENT_SESSION_EXPIRY: "5 minutes",
  CHALLENGE_CONFIRMATION_EXPIRY: "10 minutes",
  CHALLENGE_SESSION_EXPIRY: "5 minutes",

  REDIS_PORT: null,

  MONGO_INITDB_ROOT_USERNAME: null,
  MONGO_INITDB_ROOT_PASSWORD: null,
  MONGO_HOST: null,
  MONGO_EXPOSE_PORT: null,
  MONGO_DB_NAME: null,
};
