import { IConfigurationData } from "../ConfigHandler";

export const productionConfig: IConfigurationData = {
  NODE_ENVIRONMENT: process.env.NODE_ENV,
  SERVER_PORT: 3000,
  HOST: "http://device.lindorm.io",

  BASIC_AUTH_USERNAME: null,
  BASIC_AUTH_PASSWORD: null,

  JWT_ISSUER: "https://authentication.lindorm.io",

  WEB_KEY_HOST: "https://authentication.lindorm.io",

  CRYPTO_AES_SECRET: null,
  CRYPTO_SHA_SECRET: null,

  MONGO_INITDB_ROOT_USERNAME: null,
  MONGO_INITDB_ROOT_PASSWORD: null,
  MONGO_HOST: null,
  MONGO_EXPOSE_PORT: null,
  MONGO_DB_NAME: null,
};
