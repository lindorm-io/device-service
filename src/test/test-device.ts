import { CryptoLayered } from "@lindorm-io/crypto";
import { Device } from "../entity";
import { config } from "../config";
import { getTestKeyPairRSA } from "./test-key-pair";

export const getTestDevice = async ({
  accountId = "51cc7c03-3f86-44ae-8be2-5fcf5536c08b",
  macAddress = "0025:96FF:FE12:3456",
  name = "My iPhone 12",
  pincode = "123456",
  publicKey = getTestKeyPairRSA().publicKey,
  recoveryKey = "YAIBD-XMLJ6-DPTFH-AYXYU-FKBI8-O19Q1",
  secret = "test_device_secret",
  uniqueId = "a097a56f506a4091b4c93a8bfb8cec0f",
}: {
  accountId?: string;
  macAddress?: string;
  name?: string;
  publicKey?: string;
  uniqueId?: string;
  pincode?: string | null;
  recoveryKey?: string | null;
  secret?: string | null;
}): Promise<Device> => {
  const cryptoLayered = new CryptoLayered({
    aes: { secret: config.CRYPTO_AES_SECRET },
    sha: { secret: config.CRYPTO_SHA_SECRET },
  });

  return new Device({
    accountId,
    macAddress,
    name,
    publicKey,
    uniqueId,
    pincode: {
      signature: pincode === null ? null : await cryptoLayered.encrypt(pincode),
      updated: new Date(),
    },
    recoveryKey: {
      signature: recoveryKey === null ? null : await cryptoLayered.encrypt(recoveryKey),
      updated: new Date(),
    },
    secret: {
      signature: secret === null ? null : await cryptoLayered.encrypt(secret),
      updated: new Date(),
    },
  });
};
