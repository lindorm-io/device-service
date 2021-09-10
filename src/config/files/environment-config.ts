import dotenv from "dotenv";
import { Configuration } from "../interface";

dotenv.config();

export const environmentConfig: Configuration = {
  NODE_ENVIRONMENT: process.env.NODE_ENV,
  SERVER_PORT: process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT, 10) : null,
  HOST: process.env.HOST,

  // Auth
  BASIC_AUTH_USERNAME: process.env.BASIC_AUTH_USERNAME,
  BASIC_AUTH_PASSWORD: process.env.BASIC_AUTH_PASSWORD,

  // Bearer Auth
  BEARER_TOKEN_ISSUER: process.env.BEARER_TOKEN_ISSUER,

  // Crypto
  CRYPTO_AES_SECRET: process.env.CRYPTO_AES_SECRET,
  CRYPTO_SHA_SECRET: process.env.CRYPTO_SHA_SECRET,

  // Expiry
  EXPIRY_CHALLENGE_CONFIRMATION_TOKEN: process.env.EXPIRY_CHALLENGE_CONFIRMATION_TOKEN,
  EXPIRY_CHALLENGE_SESSION: process.env.EXPIRY_CHALLENGE_SESSION,
  EXPIRY_ENROLMENT_SESSION: process.env.EXPIRY_ENROLMENT_SESSION,

  // Redis
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : null,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,

  // Mongo
  MONGO_HOST: process.env.MONGO_HOST,
  MONGO_PORT: process.env.MONGO_PORT ? parseInt(process.env.MONGO_PORT, 10) : null,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME,
  MONGO_USERNAME: process.env.MONGO_USERNAME,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
};
