import { AUTH_KEYSTORE_NAME, DEVICE_KEYSTORE_NAME } from "../../constant";
import { ChallengeCache, EnrolmentCache } from "../../infrastructure";
import { KeyPairCache } from "@lindorm-io/koa-keystore";
import { getTestRedis } from "./test-redis";
import { winston } from "../../logger";

export interface IGetGreyBoxCache {
  challenge: ChallengeCache;
  enrolment: EnrolmentCache;
  keyPair: {
    auth: KeyPairCache;
    device: KeyPairCache;
  };
}

export const getTestCache = async (): Promise<IGetGreyBoxCache> => {
  const redis = await getTestRedis();

  const client = redis.getClient();
  const logger = winston;

  return {
    challenge: new ChallengeCache({ client, logger }),
    enrolment: new EnrolmentCache({ client, logger }),
    keyPair: {
      auth: new KeyPairCache({ client, logger, keystoreName: AUTH_KEYSTORE_NAME }),
      device: new KeyPairCache({ client, logger, keystoreName: DEVICE_KEYSTORE_NAME }),
    },
  };
};
