import { Device, DeviceAttributes } from "../../entity";
import { LindormRepository, RepositoryOptions } from "@lindorm-io/mongo";

export class DeviceRepository extends LindormRepository<DeviceAttributes, Device> {
  public constructor(options: RepositoryOptions) {
    super({
      ...options,
      collectionName: "device",
      indices: [
        {
          index: {
            identityId: 1,
            uniqueId: 1,
          },
          options: {
            name: "unique_on_identity",
            unique: true,
          },
        },
      ],
    });
  }

  protected createEntity(data: DeviceAttributes): Device {
    return new Device(data);
  }
}
