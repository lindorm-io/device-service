import { DefaultConfiguration } from "@lindorm-io/koa-config";

export interface Configuration extends DefaultConfiguration {
  SERVER_PORT: number;
  HOST: string;

  // Auth
  BASIC_AUTH_USERNAME: string;
  BASIC_AUTH_PASSWORD: string;

  // Bearer Auth
  BEARER_TOKEN_ISSUER: string;

  // Crypto
  CRYPTO_AES_SECRET: string;
  CRYPTO_SHA_SECRET: string;

  // Expiry
  EXPIRY_CHALLENGE_CONFIRMATION_TOKEN: string;
  EXPIRY_CHALLENGE_SESSION: string;
  EXPIRY_ENROLMENT_SESSION: string;

  // Redis
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;

  // Mongo
  MONGO_HOST: string;
  MONGO_PORT: number;
  MONGO_DB_NAME: string;
  MONGO_USERNAME: string;
  MONGO_PASSWORD: string;
}
