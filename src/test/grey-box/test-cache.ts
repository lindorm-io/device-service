import { AUTH_KEYSTORE_NAME, DEVICE_KEYSTORE_NAME } from "../../constant";
import { ChallengeCache, EnrolmentCache } from "../../infrastructure";
import { IKoaDeviceCache } from "../../typing";
import { KeyPairCache } from "@lindorm-io/koa-keystore";
import { getTestRedis } from "./test-redis";
import { winston } from "../../logger";

export const getTestCache = async (): Promise<IKoaDeviceCache> => {
  const redis = await getTestRedis();

  const client = redis.client();
  const logger = winston;

  return {
    challengeCache: new ChallengeCache({ client, logger }),
    enrolmentCache: new EnrolmentCache({ client, logger }),
    keyPair: {
      auth: new KeyPairCache({ client, logger, keystoreName: AUTH_KEYSTORE_NAME }),
      device: new KeyPairCache({ client, logger, keystoreName: DEVICE_KEYSTORE_NAME }),
    },
  };
};
