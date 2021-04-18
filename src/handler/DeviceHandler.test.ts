import { DeviceHandler } from "./DeviceHandler";
import { Device } from "../entity";
import { context } from "../test";

jest.mock("@lindorm-io/core", () => ({
  ...jest.requireActual("@lindorm-io/core"),
  getRandomNumber: jest.fn(() => "123456"),
  getRandomValue: jest.fn(() => "aBcD"),
}));

describe("DeviceHandler", () => {
  let ctx: any;
  let handler: DeviceHandler;

  beforeEach(async () => {
    ctx = {
      ...context,
    };
    handler = new DeviceHandler(ctx);
  });

  describe("PIN", () => {
    test("should encrypt device pin", async () => {
      await expect(handler.encryptDevicePIN("secret")).resolves.not.toBe("secret");
    });

    test("should assert device pin", async () => {
      ctx.entity.device = new Device({
        accountId: "account-id",
        publicKey: "public-key",
        pin: {
          signature: await handler.encryptDevicePIN("123456"),
          updated: new Date(),
        },
      });

      await expect(handler.assertDevicePIN("123456")).resolves.toBe(undefined);
    });
  });

  describe("Secret", () => {
    test("should encrypt device secret", async () => {
      await expect(handler.encryptDeviceSecret("secret")).resolves.not.toBe("secret");
    });

    test("should assert device secret", async () => {
      ctx.entity.device = new Device({
        accountId: "account-id",
        publicKey: "public-key",
        secret: {
          signature: await handler.encryptDeviceSecret("secret"),
          updated: new Date(),
        },
      });

      await expect(handler.assertDeviceSecret("secret")).resolves.toBe(undefined);
    });
  });

  describe("Recovery Key", () => {
    test("should generate device recovery key", async () => {
      await expect(handler.createDeviceRecoveryKey()).resolves.toStrictEqual("ABCD-123456-ABCD-123456-ABCD");
    });

    test("should encrypt device secret", async () => {
      await expect(handler.encryptRecoveryKey("ABCD-123456-ABCD-123456-ABCD")).resolves.not.toBe(
        "ABCD-123456-ABCD-123456-ABCD",
      );
    });

    test("should assert device recovery key", async () => {
      ctx.entity.device = new Device({
        accountId: "account-id",
        publicKey: "public-key",
        recoveryKey: {
          signature: await handler.encryptRecoveryKey("recoveryKey"),
          updated: new Date(),
        },
      });

      await expect(handler.assertDeviceRecoveryKey("recoveryKey")).resolves.toBe(undefined);
    });
  });
});
