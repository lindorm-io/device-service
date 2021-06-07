import { LindormCache, CacheOptions } from "@lindorm-io/redis";
import { Enrolment, EnrolmentAttributes } from "../entity";

export class EnrolmentCache extends LindormCache<EnrolmentAttributes, Enrolment> {
  public constructor(options: CacheOptions) {
    super({
      ...options,
      entityName: "Enrolment",
    });
  }

  protected createEntity(data: Enrolment): Enrolment {
    return new Enrolment(data);
  }
}
