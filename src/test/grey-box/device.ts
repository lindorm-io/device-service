import { Device } from "../../entity";
import { encryptDevicePIN, encryptDeviceSecret } from "../../support";
import { TEST_KEY_PAIR_RSA } from "./key-pair";
import { TEST_ACCOUNT_ID } from "./setup-integration";

export const getGreyBoxDevice = async () =>
  new Device({
    accountId: TEST_ACCOUNT_ID,
    pin: { signature: await encryptDevicePIN("123456"), updated: new Date() },
    publicKey: TEST_KEY_PAIR_RSA.publicKey,
    secret: { signature: await encryptDeviceSecret("test_device_secret"), updated: new Date() },
  });
