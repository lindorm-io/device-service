import { getTestChallenge } from "./test-challenge";
import { getTestDevice } from "./test-device";
import { Challenge, Device } from "../../entity";

interface TestEntity {
  challenge: Challenge;
  device: Device;
}

export const getTestEntity = async (): Promise<TestEntity> => ({
  challenge: getTestChallenge({}),
  device: await getTestDevice({
    pin: null,
    recoveryKey: null,
    secret: null,
  }),
});
