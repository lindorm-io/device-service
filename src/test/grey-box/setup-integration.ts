import { ChallengeCache, DeviceRepository, EnrolmentCache } from "../../infrastructure";
import { CryptoKeyPair } from "@lindorm-io/crypto";
import { KeyPairCache, KeyPairRepository } from "@lindorm-io/koa-keystore";
import { TokenIssuer } from "@lindorm-io/jwt";
import { getTestAuthIssuer, getTestDeviceIssuer } from "./test-issuer";
import { getTestCache } from "./test-cache";
import { getTestKeyPairEC, getTestKeyPairRSA } from "./test-key-pair";
import { getTestRepository } from "./test-repository";

export let TEST_DEVICE_REPOSITORY: DeviceRepository;
export let TEST_KEY_PAIR_REPOSITORY: KeyPairRepository;

export let TEST_CHALLENGE_CACHE: ChallengeCache;
export let TEST_ENROLMENT_CACHE: EnrolmentCache;
export let TEST_KEY_PAIR_CACHE: KeyPairCache;

export let TEST_ACCOUNT_ID: string;

export let TEST_AUTH_TOKEN_ISSUER: TokenIssuer;
export let TEST_DEVICE_TOKEN_ISSUER: TokenIssuer;
export let TEST_CRYPTO_KEY_PAIR: CryptoKeyPair;

export const setupIntegration = async (): Promise<void> => {
  const { deviceRepository, keyPairRepository } = await getTestRepository();
  const {
    challengeCache: challengeCache,
    enrolmentCache: enrolmentCache,
    keyPairCache: keyPairCache,
  } = await getTestCache();

  const keyPairEC = getTestKeyPairEC();
  const keyPairRSA = getTestKeyPairRSA();

  TEST_DEVICE_REPOSITORY = deviceRepository;
  TEST_KEY_PAIR_REPOSITORY = keyPairRepository;

  TEST_CHALLENGE_CACHE = challengeCache;
  TEST_ENROLMENT_CACHE = enrolmentCache;
  TEST_KEY_PAIR_CACHE = keyPairCache;

  TEST_ACCOUNT_ID = "51cc7c03-3f86-44ae-8be2-5fcf5536c08b";

  TEST_AUTH_TOKEN_ISSUER = getTestAuthIssuer();
  TEST_DEVICE_TOKEN_ISSUER = getTestDeviceIssuer();

  TEST_CRYPTO_KEY_PAIR = new CryptoKeyPair({
    algorithm: keyPairRSA.preferredAlgorithm,
    passphrase: keyPairRSA.passphrase as string,
    privateKey: keyPairRSA.privateKey as string,
    publicKey: keyPairRSA.publicKey,
  });

  await TEST_KEY_PAIR_REPOSITORY.create(keyPairEC);
  await TEST_KEY_PAIR_CACHE.create(keyPairEC);
};
