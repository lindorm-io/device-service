import { ChallengeSessionCache, EnrolmentSessionCache } from "../../infrastructure";
import { KeyPairCache } from "@lindorm-io/koa-keystore";
import { redisConnection } from "../../instance";
import { winston } from "../../logger";

interface TestCache {
  challengeSessionCache: ChallengeSessionCache;
  enrolmentSessionCache: EnrolmentSessionCache;
  keyPairCache: KeyPairCache;
}

export const getTestCache = async (): Promise<TestCache> => {
  await redisConnection.waitForConnection();
  const client = redisConnection.client();
  const logger = winston;

  return {
    challengeSessionCache: new ChallengeSessionCache({ client, logger }),
    enrolmentSessionCache: new EnrolmentSessionCache({ client, logger }),
    keyPairCache: new KeyPairCache({ client, logger }),
  };
};
