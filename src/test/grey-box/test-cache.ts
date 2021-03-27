import { ChallengeCache, EnrolmentCache } from "../../infrastructure";
import { getTestRedis } from "./test-redis";
import { winston } from "../../logger";

export interface IGetGreyBoxCache {
  challenge: ChallengeCache;
  enrolment: EnrolmentCache;
}

export const getTestCache = async (): Promise<IGetGreyBoxCache> => {
  const redis = await getTestRedis();

  const client = redis.getClient();
  const logger = winston;

  return {
    challenge: new ChallengeCache({ client, logger }),
    enrolment: new EnrolmentCache({ client, logger }),
  };
};
