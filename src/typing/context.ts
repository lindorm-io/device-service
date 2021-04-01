import { Challenge, Device } from "../entity";
import { DeviceRepository, ChallengeCache, EnrolmentCache } from "../infrastructure";
import { IKoaAppContext } from "@lindorm-io/koa";
import { ITokenIssuerVerifyData, TokenIssuer } from "@lindorm-io/jwt";
import { Keystore } from "@lindorm-io/key-pair";
import { MongoConnection } from "@lindorm-io/mongo";
import { RedisConnection } from "@lindorm-io/redis";
import { KeyPairCache, KeyPairRepository } from "@lindorm-io/koa-keystore";

export interface IKoaDeviceContext extends IKoaAppContext {
  cache: {
    challenge: ChallengeCache;
    enrolment: EnrolmentCache;
    keyPair: {
      auth: KeyPairCache;
      device: KeyPairCache;
    };
  };
  challenge: Challenge;
  device: Device;
  issuer: {
    auth: TokenIssuer;
    device: TokenIssuer;
  };
  keystore: {
    auth: Keystore;
    device: Keystore;
  };
  mongo: MongoConnection;
  redis: RedisConnection;
  repository: {
    device: DeviceRepository;
    keyPair: KeyPairRepository;
  };
  token: {
    bearer?: ITokenIssuerVerifyData;
  };
}
