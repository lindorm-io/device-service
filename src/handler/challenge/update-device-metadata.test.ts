import { getTestDevice, logger } from "../../test";
import { updateDeviceMetadata } from "./update-device-metadata";

describe("updateDeviceMetadata", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      entity: {
        device: await getTestDevice(),
      },
      logger,
      metadata: {
        agent: {
          os: "iPhone OS 13_5_1",
        },
        device: {
          name: "Test Person's iPhone",
        },
      },
      repository: {
        deviceRepository: {
          update: jest.fn(),
        },
      },
    };
  });

  test("should update device when agent os has changed", async () => {
    ctx.metadata.agent.os = "os";

    await expect(updateDeviceMetadata(ctx)).resolves.toBeUndefined();

    expect(ctx.repository.deviceRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        os: "os",
      }),
    );
  });

  test("should update device when device name has changed", async () => {
    ctx.metadata.device.name = "name";

    await expect(updateDeviceMetadata(ctx)).resolves.toBeUndefined();

    expect(ctx.repository.deviceRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "name",
      }),
    );
  });

  test("should not update device when values are the same", async () => {
    await expect(updateDeviceMetadata(ctx)).resolves.toBeUndefined();

    expect(ctx.repository.deviceRepository.update).not.toHaveBeenCalled();
  });

  test("should ignore errors", async () => {
    ctx.metadata.device.name = "name";

    ctx.repository.deviceRepository.update.mockRejectedValue(new Error());

    await expect(updateDeviceMetadata(ctx)).resolves.toBeUndefined();

    expect(ctx.repository.deviceRepository.update).toHaveBeenCalled();
  });
});
