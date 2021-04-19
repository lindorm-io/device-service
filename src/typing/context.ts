import { AccountController, ChallengeController, DeviceController, EnrolmentController } from "../controller";
import { AuthTokenHandler, ChallengeHandler, DeviceHandler, EnrolmentHandler } from "../handler";
import { Challenge, Device } from "../entity";
import { DeviceRepository, ChallengeCache, EnrolmentCache } from "../infrastructure";
import { IKoaAppContext } from "@lindorm-io/koa";
import { ITokenIssuerVerifyData, TokenIssuer } from "@lindorm-io/jwt";
import { KeyPairCache, KeyPairRepository } from "@lindorm-io/koa-keystore";
import { Keystore } from "@lindorm-io/key-pair";
import { MongoConnection } from "@lindorm-io/mongo";
import { RedisConnection } from "@lindorm-io/redis";

export interface IKoaDeviceCache {
  challengeCache: ChallengeCache;
  enrolmentCache: EnrolmentCache;
  keyPair: {
    auth: KeyPairCache;
    device: KeyPairCache;
  };
}

export interface IKoaDeviceClient {
  mongo: MongoConnection;
  redis: RedisConnection;
}

export interface IKoaDeviceController {
  accountController: AccountController;
  challengeController: ChallengeController;
  deviceController: DeviceController;
  enrolmentController: EnrolmentController;
}

export interface IKoaDeviceEntity {
  challenge?: Challenge;
  device?: Device;
}

export interface IKoaDeviceHandler {
  authTokenHandler: AuthTokenHandler;
  challengeHandler: ChallengeHandler;
  deviceHandler: DeviceHandler;
  enrolmentHandler: EnrolmentHandler;
}

export interface IKoaDeviceIssuer {
  authIssuer: TokenIssuer;
  deviceIssuer: TokenIssuer;
}

export interface IKoaDeviceKeystore {
  auth: Keystore;
  device: Keystore;
}

export interface IKoaDeviceRepository {
  deviceRepository: DeviceRepository;
  keyPairRepository: KeyPairRepository;
}

export interface IKoaDeviceToken {
  bearer?: ITokenIssuerVerifyData;
  challengeConfirmation?: ITokenIssuerVerifyData;
}

export interface IKoaDeviceContext extends IKoaAppContext {
  cache: IKoaDeviceCache;
  client: IKoaDeviceClient;
  controller: IKoaDeviceController;
  entity: IKoaDeviceEntity;
  handler: IKoaDeviceHandler;
  issuer: IKoaDeviceIssuer;
  keystore: IKoaDeviceKeystore;
  repository: IKoaDeviceRepository;
  token: IKoaDeviceToken;
}
