import { DeviceRepository } from "../../infrastructure";
import { IKoaDeviceRepository } from "../../typing";
import { KeyPairRepository } from "@lindorm-io/koa-keystore";
import { getTestMongo } from "./test-mongo";
import { winston } from "../../logger";

export const getTestRepository = async (): Promise<IKoaDeviceRepository> => {
  const mongo = await getTestMongo();

  const db = mongo.database();
  const logger = winston;

  return {
    deviceRepository: new DeviceRepository({ db, logger }),
    keyPairRepository: new KeyPairRepository({ db, logger }),
  };
};
