import { ChallengeSession, Device, EnrolmentSession } from "../entity";
import { DeviceRepository, ChallengeSessionCache, EnrolmentSessionCache } from "../infrastructure";
import { IssuerVerifyData, TokenIssuer } from "@lindorm-io/jwt";
import { KeyPair, Keystore } from "@lindorm-io/key-pair";
import { KeyPairCache, KeyPairRepository } from "@lindorm-io/koa-keystore";
import { KoaContext } from "@lindorm-io/koa";
import { MongoConnection } from "@lindorm-io/mongo";
import { RedisConnection } from "@lindorm-io/redis";

export interface DeviceContext<Body = Record<string, any>> extends KoaContext<Body> {
  cache: {
    challengeSessionCache: ChallengeSessionCache;
    enrolmentSessionCache: EnrolmentSessionCache;
    keyPairCache: KeyPairCache;
  };
  client: {
    mongo: MongoConnection;
    redis: RedisConnection;
  };
  entity: {
    challengeSession: ChallengeSession;
    device: Device;
    enrolmentSession: EnrolmentSession;
  };
  jwt: TokenIssuer;
  keys: Array<KeyPair>;
  keystore: Keystore;
  repository: {
    deviceRepository: DeviceRepository;
    keyPairRepository: KeyPairRepository;
  };
  token: {
    bearerToken: IssuerVerifyData<unknown>;
    challengeSessionToken: IssuerVerifyData<unknown>;
    challengeConfirmationToken: IssuerVerifyData<unknown>;
    enrolmentSessionToken: IssuerVerifyData<unknown>;
  };
}
