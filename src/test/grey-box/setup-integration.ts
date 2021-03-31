import { ChallengeCache, DeviceRepository, EnrolmentCache } from "../../infrastructure";
import { KeyPairCache, KeyPairRepository } from "@lindorm-io/koa-keystore";
import { KeyPairHandler } from "@lindorm-io/key-pair";
import { TokenIssuer } from "@lindorm-io/jwt";
import { getTestAuthIssuer, getTestDeviceIssuer } from "./test-issuer";
import { getTestCache } from "./test-cache";
import { getTestKeyPairEC, getTestKeyPairRSA } from "./test-key-pair";
import { getTestRepository } from "./test-repository";

export let TEST_DEVICE_REPOSITORY: DeviceRepository;
export let TEST_KEY_PAIR_REPOSITORY: KeyPairRepository;

export let TEST_CHALLENGE_CACHE: ChallengeCache;
export let TEST_ENROLMENT_CACHE: EnrolmentCache;
export let TEST_AUTH_KEY_PAIR_CACHE: KeyPairCache;
export let TEST_DEVICE_KEY_PAIR_CACHE: KeyPairCache;

export let TEST_ACCOUNT_ID: string;

export let TEST_AUTH_TOKEN_ISSUER: TokenIssuer;
export let TEST_DEVICE_TOKEN_ISSUER: TokenIssuer;
export let TEST_KEY_PAIR_HANDLER: KeyPairHandler;

export const setupIntegration = async (): Promise<void> => {
  const { device, keyPair } = await getTestRepository();
  const {
    challenge: challengeCache,
    enrolment: enrolmentCache,
    keyPair: { auth: authKeyPairCache, device: deviceKeyPairCache },
  } = await getTestCache();

  const keyPairEC = getTestKeyPairEC();
  const keyPairRSA = getTestKeyPairRSA();

  TEST_DEVICE_REPOSITORY = device;
  TEST_KEY_PAIR_REPOSITORY = keyPair;

  TEST_CHALLENGE_CACHE = challengeCache;
  TEST_ENROLMENT_CACHE = enrolmentCache;
  TEST_AUTH_KEY_PAIR_CACHE = authKeyPairCache;
  TEST_DEVICE_KEY_PAIR_CACHE = deviceKeyPairCache;

  TEST_ACCOUNT_ID = "51cc7c03-3f86-44ae-8be2-5fcf5536c08b";

  TEST_AUTH_TOKEN_ISSUER = getTestAuthIssuer();
  TEST_DEVICE_TOKEN_ISSUER = getTestDeviceIssuer();
  TEST_KEY_PAIR_HANDLER = new KeyPairHandler(keyPairRSA);

  await TEST_KEY_PAIR_REPOSITORY.create(keyPairEC);
  await TEST_AUTH_KEY_PAIR_CACHE.create(keyPairEC);
  await TEST_DEVICE_KEY_PAIR_CACHE.create(keyPairEC);
};
