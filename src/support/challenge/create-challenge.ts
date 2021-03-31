import { Challenge } from "../../entity";
import { ChallengeScope, ChallengeStrategy } from "../../enum";
import { IKoaDeviceContext } from "../../typing";
import { config } from "../../config";
import { getExpiryDate } from "../../util";
import { getRandomValue } from "@lindorm-io/core";

interface ICreateChallengeOptions {
  scope: ChallengeScope;
  strategy: ChallengeStrategy;
}

export const createChallenge = (ctx: IKoaDeviceContext) => async (
  options: ICreateChallengeOptions,
): Promise<Challenge> => {
  const { cache, device } = ctx;
  const { scope, strategy } = options;

  return await cache.challenge.create(
    new Challenge({
      certificateChallenge: getRandomValue(64),
      deviceId: device.id,
      expires: getExpiryDate(config.CHALLENGE_EXPIRY),
      scope,
      strategy,
    }),
  );
};
