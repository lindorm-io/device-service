import { ChallengeCache, EnrolmentCache } from "../../infrastructure";
import { KeyPairCache } from "@lindorm-io/koa-keystore";
import { getTestRedis } from "./test-redis";
import { winston } from "../../logger";

interface TestCache {
  challengeCache: ChallengeCache;
  enrolmentCache: EnrolmentCache;
  keyPairCache: KeyPairCache;
}

export const getTestCache = async (): Promise<TestCache> => {
  const redis = await getTestRedis();

  const client = redis.client();
  const logger = winston;

  return {
    challengeCache: new ChallengeCache({ client, logger }),
    enrolmentCache: new EnrolmentCache({ client, logger }),
    keyPairCache: new KeyPairCache({ client, logger }),
  };
};
