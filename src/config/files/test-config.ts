import { IConfigurationData } from "../ConfigHandler";

export const testConfig: IConfigurationData = {
  NODE_ENVIRONMENT: process.env.NODE_ENV,
  SERVER_PORT: 3001,
  HOST: "http://localhost/",

  JWT_ISSUER: "https://test.lindorm.io/",

  WEB_KEY_HOST: "https://test.lindorm.io",
  WEB_KEY_PATH: "/.well-known/jwks",

  CRYPTO_AES_SECRET: "secret",
  CRYPTO_SHA_SECRET: "secret",

  MONGO_INITDB_ROOT_USERNAME: "root",
  MONGO_INITDB_ROOT_PASSWORD: "password",
  MONGO_HOST: "localhost",
  MONGO_EXPOSE_PORT: 27017,
  MONGO_DB_NAME: "identity",
};
