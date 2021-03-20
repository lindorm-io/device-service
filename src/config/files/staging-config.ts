import { IConfigurationData } from "../ConfigHandler";

export const stagingConfig: IConfigurationData = {
  NODE_ENVIRONMENT: process.env.NODE_ENV,
  SERVER_PORT: 3001,
  HOST: "http://localhost/",

  JWT_ISSUER: "https://staging.lindorm.io/",

  WEB_KEY_HOST: null,
  WEB_KEY_PATH: null,

  CRYPTO_AES_SECRET: null,
  CRYPTO_SHA_SECRET: null,

  MONGO_INITDB_ROOT_USERNAME: "root",
  MONGO_INITDB_ROOT_PASSWORD: "password",
  MONGO_HOST: "localhost",
  MONGO_EXPOSE_PORT: 27017,
  MONGO_DB_NAME: "identity",
};
