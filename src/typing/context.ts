import { AccountController, ChallengeController, DeviceController, EnrolmentController } from "../controller";
import { AuthTokenHandler, ChallengeHandler, DeviceHandler, EnrolmentHandler } from "../handler";
import { Challenge, Device } from "../entity";
import { DeviceRepository, ChallengeCache, EnrolmentCache } from "../infrastructure";
import { IssuerVerifyData, TokenIssuer } from "@lindorm-io/jwt";
import { KeyPair, Keystore } from "@lindorm-io/key-pair";
import { KeyPairCache, KeyPairRepository } from "@lindorm-io/koa-keystore";
import { KoaContext } from "@lindorm-io/koa";
import { MongoConnection } from "@lindorm-io/mongo";
import { RedisConnection } from "@lindorm-io/redis";

export interface DeviceContext<Body = Record<string, any>> extends KoaContext<Body> {
  cache: {
    challengeCache: ChallengeCache;
    enrolmentCache: EnrolmentCache;
    keyPairCache: KeyPairCache;
  };
  client: {
    mongo: MongoConnection;
    redis: RedisConnection;
  };
  controller: {
    accountController: AccountController;
    challengeController: ChallengeController;
    deviceController: DeviceController;
    enrolmentController: EnrolmentController;
  };
  entity: {
    challenge: Challenge;
    device: Device;
  };
  handler: {
    authTokenHandler: AuthTokenHandler;
    challengeHandler: ChallengeHandler;
    deviceHandler: DeviceHandler;
    enrolmentHandler: EnrolmentHandler;
  };
  jwt: TokenIssuer;
  keys: Array<KeyPair>;
  keystore: Keystore;
  repository: {
    deviceRepository: DeviceRepository;
    keyPairRepository: KeyPairRepository;
  };
  token: {
    bearer: IssuerVerifyData<unknown>;
    challengeConfirmation: IssuerVerifyData<unknown>;
  };
}
