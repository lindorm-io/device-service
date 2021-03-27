import { CacheBase, ICache, ICacheOptions } from "@lindorm-io/redis";
import { IEnrolment, Enrolment } from "../../entity";
import { schema } from "./schema";

interface IEnrolmentCache extends ICache<Enrolment> {
  create(entity: Enrolment): Promise<Enrolment>;
  find(id: string): Promise<Enrolment>;
  findAll(): Promise<Array<Enrolment>>;
  remove(entity: Enrolment): Promise<void>;
}

export class EnrolmentCache extends CacheBase<Enrolment> implements IEnrolmentCache {
  constructor(options: ICacheOptions) {
    super({
      client: options.client,
      entityName: "Enrolment",
      expiresInSeconds: options.expiresInSeconds,
      logger: options.logger,
      schema,
    });
  }

  protected createEntity(data: IEnrolment): Enrolment {
    return new Enrolment(data);
  }

  protected getEntityJSON(entity: Enrolment): IEnrolment {
    return {
      id: entity.id,
      version: entity.version,
      created: entity.created,
      updated: entity.updated,
      events: entity.events,

      accountId: entity.accountId,
      certificateChallenge: entity.certificateChallenge,
      expires: entity.expires,
      macAddress: entity.macAddress,
      name: entity.name,
      publicKey: entity.publicKey,
      uniqueId: entity.uniqueId,
    };
  }

  protected getEntityKey(entity: Enrolment): string {
    return entity.id;
  }

  public async create(entity: Enrolment): Promise<Enrolment> {
    return super.create(entity);
  }

  public async find(id: string): Promise<Enrolment> {
    return super.find(id);
  }

  public async findAll(): Promise<Array<Enrolment>> {
    return super.findAll();
  }

  public async remove(entity: Enrolment): Promise<void> {
    await super.remove(entity);
  }
}
