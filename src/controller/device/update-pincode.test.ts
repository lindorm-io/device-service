import MockDate from "mockdate";
import { deviceUpdatePincodeController } from "./update-pincode";
import { getTestDevice } from "../../test";

MockDate.set("2021-01-01T08:00:00.000Z");

jest.mock("../../instance", () => ({
  cryptoLayered: {
    encrypt: (arg: any) => `${arg}-signature`,
  },
}));

describe("deviceUpdatePincodeController", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      data: {
        pincode: "new-pincode",
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

  test("should resolve and update device pincode", async () => {
    await expect(deviceUpdatePincodeController(ctx)).resolves.toStrictEqual({
      data: {},
    });

    expect(ctx.repository.deviceRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        pincode: "new-pincode-signature",
      }),
    );
  });

  test("should resolve and update with agent os", async () => {
    ctx.metadata.agent.os = "os";

    await expect(deviceUpdatePincodeController(ctx)).resolves.toStrictEqual({
      data: {},
    });

    expect(ctx.repository.deviceRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        os: "os",
      }),
    );
  });

  test("should resolve and update with device name", async () => {
    ctx.metadata.device.name = "name";

    await expect(deviceUpdatePincodeController(ctx)).resolves.toStrictEqual({
      data: {},
    });

    expect(ctx.repository.deviceRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "name",
      }),
    );
  });
});
