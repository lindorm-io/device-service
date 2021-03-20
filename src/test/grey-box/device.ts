import { Device } from "../../entity";
import { TEST_ACCOUNT_ID } from "./setup-integration";
import { TEST_KEY_PAIR_RSA } from "./key-pair";
import { encryptDevicePIN, encryptDeviceSecret } from "../../support";

export const getGreyBoxDevice = async () =>
  new Device({
    accountId: TEST_ACCOUNT_ID,
    pin: { signature: await encryptDevicePIN("123456"), updated: new Date() },
    publicKey: TEST_KEY_PAIR_RSA.publicKey,
    secret: { signature: await encryptDeviceSecret("test_device_secret"), updated: new Date() },
  });
