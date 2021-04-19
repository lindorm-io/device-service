import { getTestChallenge } from "./test-challenge";
import { getTestDevice } from "./test-device";

export const getTestEntity = async () => ({
  challenge: getTestChallenge({}),
  device: await getTestDevice({
    pin: null,
    recoveryKey: null,
    secret: null,
  }),
});
