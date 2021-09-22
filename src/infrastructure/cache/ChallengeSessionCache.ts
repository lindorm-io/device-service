import { LindormCache, CacheOptions } from "@lindorm-io/redis";
import { ChallengeSession, ChallengeSessionAttributes } from "../../entity";

export class ChallengeSessionCache extends LindormCache<
  ChallengeSessionAttributes,
  ChallengeSession
> {
  public constructor(options: CacheOptions) {
    super({
      ...options,
      entityName: "ChallengeSession",
      indexedAttributes: [],
    });
  }

  protected createEntity(data: ChallengeSession): ChallengeSession {
    return new ChallengeSession(data);
  }
}
