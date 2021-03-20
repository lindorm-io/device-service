import { IConfigurationData } from "../ConfigHandler";

export const environmentConfig: IConfigurationData = {
  NODE_ENVIRONMENT: process.env.NODE_ENV,
  SERVER_PORT: process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT, 10) : null,
  HOST: process.env.HOST,

  JWT_ISSUER: process.env.JWT_ISSUER,

  WEB_KEY_HOST: process.env.JWKS_HOST,
  WEB_KEY_PATH: process.env.JWKS_PATH,

  CRYPTO_AES_SECRET: process.env.CRYPTO_AES_SECRET,
  CRYPTO_SHA_SECRET: process.env.CRYPTO_SHA_SECRET,

  MONGO_INITDB_ROOT_USERNAME: process.env.MONGO_INITDB_ROOT_USERNAME,
  MONGO_INITDB_ROOT_PASSWORD: process.env.MONGO_INITDB_ROOT_PASSWORD,
  MONGO_HOST: process.env.MONGO_HOST,
  MONGO_EXPOSE_PORT: process.env.MONGO_EXPOSE_PORT ? parseInt(process.env.MONGO_EXPOSE_PORT, 10) : null,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME,
};
