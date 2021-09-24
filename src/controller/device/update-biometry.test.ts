import MockDate from "mockdate";
import { deviceUpdateBiometryController } from "./update-biometry";
import { getTestDevice } from "../../test";

MockDate.set("2021-01-01T08:00:00.000Z");

jest.mock("../../instance", () => ({
  cryptoLayered: {
    encrypt: (arg: any) => `${arg}-signature`,
  },
}));

describe("deviceUpdateBiometryController", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      data: {
        biometry: "new-biometry",
      },
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

  test("should resolve and update device biometry", async () => {
    await expect(deviceUpdateBiometryController(ctx)).resolves.toStrictEqual({
      body: {},
    });

    expect(ctx.repository.deviceRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        biometry: "new-biometry-signature",
      }),
    );
  });

  test("should resolve and update with agent os", async () => {
    ctx.metadata.agent.os = "os";

    await expect(deviceUpdateBiometryController(ctx)).resolves.toStrictEqual({
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

    await expect(deviceUpdateBiometryController(ctx)).resolves.toStrictEqual({
      body: {},
    });

    expect(ctx.repository.deviceRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "name",
      }),
    );
  });
});
