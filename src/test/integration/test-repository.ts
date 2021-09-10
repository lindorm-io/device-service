import { getTestMongo } from "./test-infrastructure";
import { winston } from "../../logger";
import { DeviceRepository } from "../../infrastructure";

interface TestRepository {
  deviceRepository: DeviceRepository;
}

export const getTestRepository = async (): Promise<TestRepository> => {
  const mongo = await getTestMongo();
  const db = mongo.database();
  const logger = winston;
  return {
    deviceRepository: new DeviceRepository({ db, logger }),
  };
};
