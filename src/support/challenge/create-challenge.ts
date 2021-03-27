import { CHALLENGE_EXPIRY } from "../../config";
import { Challenge } from "../../entity";
import { IKoaDeviceContext } from "../../typing";
import { getExpiryDate } from "../../util";
import { getRandomValue } from "@lindorm-io/core";
import { ChallengeStrategy } from "../../enum";

interface ICreateChallengeOptions {
  strategy: ChallengeStrategy;
}

export const createChallenge = (ctx: IKoaDeviceContext) => async (
  options: ICreateChallengeOptions,
): Promise<Challenge> => {
  const { cache, device } = ctx;
  const { strategy } = options;

  return await cache.challenge.create(
    new Challenge({
      certificateChallenge: getRandomValue(64),
      deviceId: device.id,
      expires: getExpiryDate(CHALLENGE_EXPIRY),
      strategy,
    }),
  );
};
