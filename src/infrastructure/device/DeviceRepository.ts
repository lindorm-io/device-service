import { Device, IDevice } from "../../entity";
import { IRepository, IRepositoryOptions, RepositoryBase } from "@lindorm-io/mongo";
import { MongoCollection } from "../../enum";
import { indices } from "./indices";
import { schema } from "./schema";

interface IDeviceFilter {
  id?: string;
  accountId?: string;
  name?: string;
}

interface IDeviceRepository extends IRepository<Device> {
  create(entity: Device): Promise<Device>;
  update(entity: Device): Promise<Device>;
  find(filter: IDeviceFilter): Promise<Device>;
  findMany(filter: IDeviceFilter): Promise<Array<Device>>;
  findOrCreate(filter: IDeviceFilter): Promise<Device>;
  remove(entity: Device): Promise<void>;
}

export class DeviceRepository extends RepositoryBase<Device> implements IDeviceRepository {
  constructor(options: IRepositoryOptions) {
    super({
      collectionName: MongoCollection.DEVICE,
      db: options.db,
      logger: options.logger,
      indices,
      schema,
    });
  }

  protected createEntity(data: IDevice): Device {
    return new Device(data);
  }

  protected getEntityJSON(entity: Device): IDevice {
    return {
      id: entity.id,
      version: entity.version,
      created: entity.created,
      updated: entity.updated,
      events: entity.events,

      accountId: entity.accountId,
      macAddress: entity.macAddress,
      name: entity.name,
      pin: entity.pin,
      publicKey: entity.publicKey,
      secret: entity.secret,
      uniqueId: entity.uniqueId,
    };
  }

  public async create(entity: Device): Promise<Device> {
    return super.create(entity);
  }

  public async update(entity: Device): Promise<Device> {
    return super.update(entity);
  }

  public async find(filter: IDeviceFilter): Promise<Device> {
    return super.find(filter);
  }

  public async findMany(filter: IDeviceFilter): Promise<Array<Device>> {
    return super.findMany(filter);
  }

  public async remove(entity: Device): Promise<void> {
    await super.remove(entity);
  }
}
