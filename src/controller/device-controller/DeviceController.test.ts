import MockDate from "mockdate";
import { DeviceController } from "./DeviceController";
import { getTestContext, inMemoryStore, resetAll } from "../../test";

MockDate.set("2020-01-01 08:00:00.000");

describe("DeviceController", () => {
  let ctx: any;
  let controller: DeviceController;

  beforeEach(async () => {
    ctx = {
      ...(await getTestContext()),
      token: {
        challengeConfirmation: {
          deviceId: "d9b9adec-81fa-4ea0-8cf3-44ccd4fe5162",
        },
      },
    };

    await ctx.repository.deviceRepository.create(ctx.entity.device);

    controller = new DeviceController(ctx);
  });

  afterEach(resetAll);

  describe("generateRecoveryKey", () => {
    test("should update device recovery key", async () => {
      await expect(controller.generateRecoveryKey()).resolves.toMatchSnapshot();
      expect(inMemoryStore).toMatchSnapshot();
    });
  });

  describe("updateName", () => {
    test("should update device name", async () => {
      await expect(
        controller.updateName({
          deviceId: "d9b9adec-81fa-4ea0-8cf3-44ccd4fe5162",
          name: "name",
        }),
      ).resolves.toBe(undefined);
      expect(inMemoryStore).toMatchSnapshot();
    });
  });

  describe("updatePin", () => {
    test("should update device pin", async () => {
      await expect(
        controller.updatePin({
          pin: "123456",
        }),
      ).resolves.toBe(undefined);
      expect(inMemoryStore).toMatchSnapshot();
    });
  });

  describe("updateSecret", () => {
    test("should update device secret", async () => {
      await expect(
        controller.updateSecret({
          secret: "new_updated_secret",
        }),
      ).resolves.toBe(undefined);
      expect(inMemoryStore).toMatchSnapshot();
    });
  });

  describe("remove", () => {
    test("should remove a device", async () => {
      await expect(
        controller.remove({
          deviceId: "d9b9adec-81fa-4ea0-8cf3-44ccd4fe5162",
        }),
      ).resolves.toBe(undefined);
      expect(inMemoryStore).toMatchSnapshot();
    });
  });
});
