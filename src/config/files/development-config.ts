import { Configuration } from "../interface";

export const developmentConfig: Configuration = {
  NODE_ENVIRONMENT: process.env.NODE_ENV,
  SERVER_PORT: 3003,
  HOST: "http://localhost",

  // Auth
  BASIC_AUTH_USERNAME: "secret",
  BASIC_AUTH_PASSWORD: "secret",

  // Bearer Auth
  BEARER_TOKEN_ISSUER: "http://localhost:3004",

  // Crypto
  CRYPTO_AES_SECRET: "secret",
  CRYPTO_SHA_SECRET: "secret",

  // Expiry
  EXPIRY_CHALLENGE_CONFIRMATION_TOKEN: "10 minutes",
  EXPIRY_CHALLENGE_SESSION: "3 minutes",
  EXPIRY_ENROLMENT_SESSION: "5 minutes",

  // Redis
  REDIS_HOST: "localhost",
  REDIS_PORT: 6379,
  REDIS_PASSWORD: "secret",

  // Mongo
  MONGO_HOST: "localhost",
  MONGO_PORT: 27017,
  MONGO_DB_NAME: "device",
  MONGO_USERNAME: "root",
  MONGO_PASSWORD: "example",
};
