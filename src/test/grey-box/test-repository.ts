import { DeviceRepository } from "../../infrastructure";
import { KeyPairRepository } from "@lindorm-io/koa-keystore";
import { getTestMongo } from "./test-mongo";
import { winston } from "../../logger";

export interface IGetGreyBoxRepository {
  device: DeviceRepository;
  keyPair: KeyPairRepository;
}

export const getTestRepository = async (): Promise<IGetGreyBoxRepository> => {
  const mongo = await getTestMongo();

  const db = mongo.getDatabase();
  const logger = winston;

  return {
    device: new DeviceRepository({ db, logger }),
    keyPair: new KeyPairRepository({ db, logger }),
  };
};
