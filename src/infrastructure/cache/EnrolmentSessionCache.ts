import { LindormCache, CacheOptions } from "@lindorm-io/redis";
import { EnrolmentSession, EnrolmentSessionAttributes } from "../../entity";

export class EnrolmentSessionCache extends LindormCache<
  EnrolmentSessionAttributes,
  EnrolmentSession
> {
  public constructor(options: CacheOptions) {
    super({
      ...options,
      entityName: "EnrolmentSession",
      indexedAttributes: [],
    });
  }

  protected createEntity(data: EnrolmentSession): EnrolmentSession {
    return new EnrolmentSession(data);
  }
}
