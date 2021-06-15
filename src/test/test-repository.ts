import { DeviceRepository } from "../infrastructure";
import { KeyPairRepository } from "@lindorm-io/koa-keystore";
import { getTestMongo } from "./test-mongo";
import { winston } from "../logger";

interface TestRepository {
  deviceRepository: DeviceRepository;
  keyPairRepository: KeyPairRepository;
}

export const getTestRepository = async (): Promise<TestRepository> => {
  const mongo = await getTestMongo();

  const db = mongo.database();
  const logger = winston;

  return {
    deviceRepository: new DeviceRepository({ db, logger }),
    keyPairRepository: new KeyPairRepository({ db, logger }),
  };
};
