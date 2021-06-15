import { ChallengeSessionCache, DeviceRepository, EnrolmentSessionCache } from "../infrastructure";
import { CryptoKeyPair } from "@lindorm-io/crypto";
import { KeyPairCache } from "@lindorm-io/koa-keystore";
import { TokenIssuer } from "@lindorm-io/jwt";
import { getTestAuthIssuer, getTestDeviceIssuer } from "./test-issuer";
import { getTestCache } from "./test-cache";
import { getTestKeyPairEC, getTestKeyPairRSA } from "./test-key-pair";
import { getTestRepository } from "./test-repository";

export let TEST_CHALLENGE_CACHE: ChallengeSessionCache;
export let TEST_DEVICE_REPOSITORY: DeviceRepository;
export let TEST_ENROLMENT_CACHE: EnrolmentSessionCache;
export let TEST_KEY_PAIR_CACHE: KeyPairCache;

export let TEST_AUTH_TOKEN_ISSUER: TokenIssuer;
export let TEST_DEVICE_TOKEN_ISSUER: TokenIssuer;

export let TEST_CRYPTO_KEY_PAIR: CryptoKeyPair;

export const setupIntegration = async (): Promise<void> => {
  const { challengeSessionCache, enrolmentSessionCache, keyPairCache } = await getTestCache();
  const { deviceRepository } = await getTestRepository();

  TEST_CHALLENGE_CACHE = challengeSessionCache;
  TEST_DEVICE_REPOSITORY = deviceRepository;
  TEST_ENROLMENT_CACHE = enrolmentSessionCache;
  TEST_KEY_PAIR_CACHE = keyPairCache;

  TEST_AUTH_TOKEN_ISSUER = getTestAuthIssuer();
  TEST_DEVICE_TOKEN_ISSUER = getTestDeviceIssuer();

  const keyPairRSA = getTestKeyPairRSA();

  TEST_CRYPTO_KEY_PAIR = new CryptoKeyPair({
    algorithm: keyPairRSA.preferredAlgorithm,
    passphrase: keyPairRSA.passphrase as string,
    privateKey: keyPairRSA.privateKey as string,
    publicKey: keyPairRSA.publicKey,
  });

  await TEST_KEY_PAIR_CACHE.create(getTestKeyPairEC());
};
