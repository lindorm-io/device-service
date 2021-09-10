import { getTestCache } from "./test-cache";
import { getTestKeyPairEC } from "./test-key-pair";
import { getTestRepository } from "./test-repository";
import {
  ChallengeSessionCache,
  EnrolmentSessionCache,
  DeviceRepository,
} from "../../infrastructure";

export let TEST_CHALLENGE_SESSION_CACHE: ChallengeSessionCache;
export let TEST_ENROLMENT_SESSION_CACHE: EnrolmentSessionCache;

export let TEST_DEVICE_REPOSITORY: DeviceRepository;

export const setupIntegration = async (): Promise<void> => {
  const { challengeSessionCache, enrolmentSessionCache, keyPairCache } =
    await getTestCache();
  const { deviceRepository } = await getTestRepository();

  TEST_CHALLENGE_SESSION_CACHE = challengeSessionCache;
  TEST_ENROLMENT_SESSION_CACHE = enrolmentSessionCache;

  TEST_DEVICE_REPOSITORY = deviceRepository;

  await keyPairCache.create(getTestKeyPairEC());
};
