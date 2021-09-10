import { ChallengeSession, Device, EnrolmentSession } from "../entity";
import { IssuerVerifyData, TokenIssuer } from "@lindorm-io/jwt";
import { KeyPair, Keystore } from "@lindorm-io/key-pair";
import { KeyPairCache, KeyPairRepository } from "@lindorm-io/koa-keystore";
import { KoaContext } from "@lindorm-io/koa";
import { MongoConnection } from "@lindorm-io/mongo";
import { RedisConnection } from "@lindorm-io/redis";
import {
  ChallengeSessionCache,
  DeviceRepository,
  EnrolmentSessionCache,
} from "../infrastructure";

export interface Context<Body = Record<string, any>> extends KoaContext<Body> {
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
    bearerToken: IssuerVerifyData<never, never>;
    challengeSessionToken: IssuerVerifyData<unknown, unknown>;
    challengeConfirmationToken: IssuerVerifyData<unknown, unknown>;
    enrolmentSessionToken: IssuerVerifyData<unknown, unknown>;
  };
}
