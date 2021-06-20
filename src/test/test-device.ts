import { CryptoLayered } from "@lindorm-io/crypto";
import { Device } from "../entity";
import { config } from "../config";
import { getTestKeyPairRSA } from "./test-key-pair";

export const getTestDevice = async ({
  accountId = "51cc7c03-3f86-44ae-8be2-5fcf5536c08b",
  biometry = "test_device_biometry",
  macAddress = "0025:96FF:FE12:3456",
  name = "My iPhone 12",
  pincode = "123456",
  publicKey = getTestKeyPairRSA().publicKey,
  recoveryKey = "YAIBD-XMLJ6-DPTFH-AYXYU-FKBI8-O19Q1",
  uniqueId = "a097a56f506a4091b4c93a8bfb8cec0f",
}: {
  accountId?: string;
  biometry?: string | null;
  macAddress?: string;
  name?: string;
  pincode?: string | null;
  publicKey?: string;
  recoveryKey?: string | null;
  uniqueId?: string;
}): Promise<Device> => {
  const cryptoLayered = new CryptoLayered({
    aes: { secret: config.CRYPTO_AES_SECRET },
    sha: { secret: config.CRYPTO_SHA_SECRET },
  });

  return new Device({
    accountId,
    biometry: biometry === null ? null : await cryptoLayered.encrypt(biometry),
    macAddress,
    name,
    pincode: pincode === null ? null : await cryptoLayered.encrypt(pincode),
    publicKey,
    recoveryKey: recoveryKey === null ? null : await cryptoLayered.encrypt(recoveryKey),
    uniqueId,
  });
};
