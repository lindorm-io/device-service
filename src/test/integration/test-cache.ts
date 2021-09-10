import { ChallengeSessionCache, EnrolmentSessionCache } from "../../infrastructure";
import { KeyPairCache } from "@lindorm-io/koa-keystore";
import { getTestRedis } from "./test-infrastructure";
import { winston } from "../../logger";

interface TestCache {
  challengeSessionCache: ChallengeSessionCache;
  enrolmentSessionCache: EnrolmentSessionCache;
  keyPairCache: KeyPairCache;
}

export const getTestCache = async (): Promise<TestCache> => {
  const redis = await getTestRedis();
  const client = redis.client();
  const logger = winston;
  return {
    challengeSessionCache: new ChallengeSessionCache({ client, logger }),
    enrolmentSessionCache: new EnrolmentSessionCache({ client, logger }),
    keyPairCache: new KeyPairCache({ client, logger }),
  };
};
