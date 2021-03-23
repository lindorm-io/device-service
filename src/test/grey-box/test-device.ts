import { Device } from "../../entity";
import { TEST_ACCOUNT_ID } from "./setup-integration";
import { encryptDevicePIN, encryptDeviceSecret } from "../../support";
import { getTestKeyPairRSA } from "./test-key-pair";

export const getTestDevice = async (): Promise<Device> =>
  new Device({
    accountId: TEST_ACCOUNT_ID,
    pin: { signature: await encryptDevicePIN("123456"), updated: new Date() },
    publicKey: getTestKeyPairRSA().publicKey,
    secret: { signature: await encryptDeviceSecret("test_device_secret"), updated: new Date() },
  });
