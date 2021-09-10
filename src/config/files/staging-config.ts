import { Configuration } from "../interface";

export const stagingConfig: Configuration = {
  NODE_ENVIRONMENT: process.env.NODE_ENV,
  SERVER_PORT: 3000,
  HOST: "https://device.staging.api.lindorm.io",

  // Auth
  BASIC_AUTH_USERNAME: null,
  BASIC_AUTH_PASSWORD: null,

  // Bearer Auth
  BEARER_TOKEN_ISSUER: "https://oauth.staging.api.lindorm.io",

  // Crypto
  CRYPTO_AES_SECRET: null,
  CRYPTO_SHA_SECRET: null,

  // Expiry
  EXPIRY_CHALLENGE_CONFIRMATION_TOKEN: "10 minutes",
  EXPIRY_CHALLENGE_SESSION: "3 minutes",
  EXPIRY_ENROLMENT_SESSION: "5 minutes",

  // Redis
  REDIS_HOST: null,
  REDIS_PORT: null,
  REDIS_PASSWORD: null,

  // Mongo
  MONGO_HOST: null,
  MONGO_PORT: null,
  MONGO_DB_NAME: "device",
  MONGO_USERNAME: null,
  MONGO_PASSWORD: null,
};
