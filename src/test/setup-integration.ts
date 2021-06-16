import { CryptoKeyPair } from "@lindorm-io/crypto";
import { DeviceRepository } from "../infrastructure";
import { getTestCache } from "./test-cache";
import { getTestKeyPairEC, getTestKeyPairRSA } from "./test-key-pair";
import { getTestRepository } from "./test-repository";

export let TEST_DEVICE_REPOSITORY: DeviceRepository;
export let TEST_CRYPTO_KEY_PAIR: CryptoKeyPair;

export const setupIntegration = async (): Promise<void> => {
  const { keyPairCache } = await getTestCache();
  const { deviceRepository } = await getTestRepository();
  const keyPairRSA = getTestKeyPairRSA();

  TEST_DEVICE_REPOSITORY = deviceRepository;
  TEST_CRYPTO_KEY_PAIR = new CryptoKeyPair({
    algorithm: keyPairRSA.preferredAlgorithm,
    passphrase: keyPairRSA.passphrase as string,
    privateKey: keyPairRSA.privateKey as string,
    publicKey: keyPairRSA.publicKey,
  });

  await keyPairCache.create(getTestKeyPairEC());
};
