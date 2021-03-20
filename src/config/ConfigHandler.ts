import { ConfigurationBase, IConfigurationDataBase, IConfigurationOptions } from "@lindorm-io/core";

export interface IConfigurationData extends IConfigurationDataBase {
  SERVER_PORT: number;
  HOST: string;

  BASIC_AUTH_USERNAME: string;
  BASIC_AUTH_PASSWORD: string;

  JWT_ISSUER: string;

  WEB_KEY_HOST: string;

  CRYPTO_AES_SECRET: string;
  CRYPTO_SHA_SECRET: string;

  MONGO_INITDB_ROOT_USERNAME: string;
  MONGO_INITDB_ROOT_PASSWORD: string;
  MONGO_HOST: string;
  MONGO_EXPOSE_PORT: number;
  MONGO_DB_NAME: string;
}

export class ConfigHandler extends ConfigurationBase<IConfigurationData> {
  constructor(options: IConfigurationOptions<IConfigurationData>) {
    super(options);
  }
}
