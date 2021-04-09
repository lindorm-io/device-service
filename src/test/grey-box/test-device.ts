import { Device } from "../../entity";
import { encryptDevicePIN, encryptDeviceRecoveryKey, encryptDeviceSecret } from "../../support";
import { getTestKeyPairRSA } from "./test-key-pair";

export const getTestDevice = async ({
  id = "d9b9adec-81fa-4ea0-8cf3-44ccd4fe5162",
  accountId = "51cc7c03-3f86-44ae-8be2-5fcf5536c08b",
  macAddress = "0025:96FF:FE12:3456",
  name = "My iPhone 12",
  pin = "123456",
  publicKey = getTestKeyPairRSA().publicKey,
  recoveryKey = "123456-123456-123456",
  secret = "test_device_secret",
  uniqueId = "a097a56f506a4091b4c93a8bfb8cec0f",
}: {
  id?: string;
  accountId?: string;
  macAddress?: string;
  name?: string;
  pin?: string;
  publicKey?: string;
  recoveryKey?: string;
  secret?: string;
  uniqueId?: string;
}): Promise<Device> =>
  new Device({
    id,
    accountId,
    macAddress,
    name,
    pin: pin ? { signature: await encryptDevicePIN(pin), updated: new Date() } : null,
    publicKey,
    recoveryKeys: recoveryKey ? [await encryptDeviceRecoveryKey(recoveryKey)] : [],
    secret: secret ? { signature: await encryptDeviceSecret(secret), updated: new Date() } : null,
    uniqueId,
  });
