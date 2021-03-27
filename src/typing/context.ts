import { Device } from "../entity";
import { DeviceRepository, ChallengeCache, EnrolmentCache } from "../infrastructure";
import { IKoaAppContext } from "@lindorm-io/koa";
import { ITokenIssuerVerifyData, TokenIssuer } from "@lindorm-io/jwt";
import { Keystore } from "@lindorm-io/key-pair";
import { MongoConnection } from "@lindorm-io/mongo";
import { RedisConnection } from "@lindorm-io/redis";

export interface IKoaDeviceContext extends IKoaAppContext {
  cache: {
    challenge: ChallengeCache;
    enrolment: EnrolmentCache;
  };
  device: Device;
  issuer: {
    tokenIssuer: TokenIssuer;
  };
  keystore: Keystore;
  mongo: MongoConnection;
  redis: RedisConnection;
  repository: {
    device: DeviceRepository;
  };
  token: {
    bearer?: ITokenIssuerVerifyData;
  };
}
