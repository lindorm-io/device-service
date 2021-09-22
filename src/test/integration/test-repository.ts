import { DeviceRepository } from "../../infrastructure";
import { mongoConnection } from "../../instance";
import { winston } from "../../logger";

interface TestRepository {
  deviceRepository: DeviceRepository;
}

export const getTestRepository = async (): Promise<TestRepository> => {
  await mongoConnection.waitForConnection();
  const db = mongoConnection.database();
  const logger = winston;

  return {
    deviceRepository: new DeviceRepository({ db, logger }),
  };
};
