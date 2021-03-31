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
  recoveryKey = "test_device_recovery_key",
  secret = "test_device_secret",
  uniqueId = "7e5bfe57-bc9a-4523-adc7-c9ed728d866d",
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
