import { deviceUpdateTrustedController } from "./update-trusted";
import { getTestDevice } from "../../test";

describe("deviceUpdateTrustedController", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      entity: {
        device: await getTestDevice(),
      },
      metadata: {
        agent: { os: null },
        device: { name: null },
      },
      repository: {
        deviceRepository: {
          update: jest.fn(),
        },
      },
    };
  });

  test("should resolve and update device trusted", async () => {
    await expect(deviceUpdateTrustedController(ctx)).resolves.toStrictEqual({
      body: {},
    });

    expect(ctx.repository.deviceRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        trusted: true,
      }),
    );
  });

  test("should resolve and update with agent os", async () => {
    ctx.metadata.agent.os = "os";

    await expect(deviceUpdateTrustedController(ctx)).resolves.toStrictEqual({
      body: {},
    });

    expect(ctx.repository.deviceRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        os: "os",
      }),
    );
  });

  test("should resolve and update with device name", async () => {
    ctx.metadata.device.name = "name";

    await expect(deviceUpdateTrustedController(ctx)).resolves.toStrictEqual({
      body: {},
    });

    expect(ctx.repository.deviceRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "name",
      }),
    );
  });
});
