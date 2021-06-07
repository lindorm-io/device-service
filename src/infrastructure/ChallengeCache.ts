import { LindormCache, CacheOptions } from "@lindorm-io/redis";
import { Challenge, ChallengeAttributes } from "../entity";

export class ChallengeCache extends LindormCache<ChallengeAttributes, Challenge> {
  public constructor(options: CacheOptions) {
    super({
      ...options,
      entityName: "Challenge",
    });
  }

  protected createEntity(data: Challenge): Challenge {
    return new Challenge(data);
  }
}
