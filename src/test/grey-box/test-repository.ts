import { DeviceRepository } from "../../infrastructure";
import { getTestMongo } from "./test-mongo";
import { winston } from "../../logger";

export interface IGetGreyBoxRepository {
  device: DeviceRepository;
}

export const getTestRepository = async (): Promise<IGetGreyBoxRepository> => {
  const mongo = await getTestMongo();

  const db = mongo.getDatabase();
  const logger = winston;

  return {
    device: new DeviceRepository({ db, logger }),
  };
};
