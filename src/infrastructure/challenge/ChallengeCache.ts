import { CacheBase, ICache, ICacheOptions } from "@lindorm-io/redis";
import { IChallenge, Challenge } from "../../entity";
import { schema } from "./schema";

interface IChallengeCache extends ICache<Challenge> {
  create(entity: Challenge): Promise<Challenge>;
  find(id: string): Promise<Challenge>;
  findAll(): Promise<Array<Challenge>>;
  remove(entity: Challenge): Promise<void>;
}

export class ChallengeCache extends CacheBase<Challenge> implements IChallengeCache {
  constructor(options: ICacheOptions) {
    super({
      client: options.client,
      entityName: "Challenge",
      expiresInSeconds: options.expiresInSeconds,
      logger: options.logger,
      schema,
    });
  }

  protected createEntity(data: IChallenge): Challenge {
    return new Challenge(data);
  }

  protected getEntityJSON(entity: Challenge): IChallenge {
    return {
      id: entity.id,
      version: entity.version,
      created: entity.created,
      updated: entity.updated,
      events: entity.events,

      certificateChallenge: entity.certificateChallenge,
      deviceId: entity.deviceId,
      expires: entity.expires,
      scope: entity.scope,
      strategy: entity.strategy,
    };
  }

  protected getEntityKey(entity: Challenge): string {
    return entity.id;
  }

  public async create(entity: Challenge): Promise<Challenge> {
    return super.create(entity);
  }

  public async find(id: string): Promise<Challenge> {
    return super.find(id);
  }

  public async findAll(): Promise<Array<Challenge>> {
    return super.findAll();
  }

  public async remove(entity: Challenge): Promise<void> {
    await super.remove(entity);
  }
}
