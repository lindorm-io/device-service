import { Device } from "../entity";
import { DeviceRepository } from "../infrastructure";
import { IKoaAppContext } from "@lindorm-io/koa";
import { ITokenIssuerVerifyData, TokenIssuer } from "@lindorm-io/jwt";
import { Keystore } from "@lindorm-io/key-pair";
import { MongoConnection } from "@lindorm-io/mongo";

export interface IKoaDeviceContext extends IKoaAppContext {
  device: Device;
  issuer: {
    tokenIssuer: TokenIssuer;
  };
  keystore: Keystore;
  mongo: MongoConnection;
  repository: {
    device: DeviceRepository;
  };
  token: {
    bearer?: ITokenIssuerVerifyData;
  };
}
