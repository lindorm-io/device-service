import { DeviceHandler } from "./DeviceHandler";
import { Device } from "../entity";
import { context } from "../test";

jest.mock("@lindorm-io/core", () => ({
  ...(jest.requireActual("@lindorm-io/core") as any),
  getRandomValue: jest
    .fn()
    .mockImplementationOnce(() => "aBcD")
    .mockImplementationOnce(() => "eFgH")
    .mockImplementationOnce(() => "iJkL")
    .mockImplementationOnce(() => "mNoP")
    .mockImplementationOnce(() => "qRsT")
    .mockImplementationOnce(() => "uVwX")
    .mockImplementationOnce(() => "yZaB"),
}));

describe("DeviceHandler", () => {
  let ctx: any;
  let handler: any;

  beforeEach(async () => {
    ctx = {
      ...context,
    };
    handler = new DeviceHandler(ctx);
  });

  describe("PIN", () => {
    test("should encrypt device pin", async () => {
      await expect(handler.encryptPin("secret")).resolves.not.toBe("secret");
    });

    test("should assert device pin", async () => {
      ctx.entity.device = new Device({
        accountId: "account-id",
        macAddress: "macAddress",
        name: "name",
        publicKey: "public-key",
        uniqueId: "uniqueId",
        pin: {
          signature: await handler.encryptPin("123456"),
          updated: new Date(),
        },
      });

      await expect(handler.assertPin("123456")).resolves.toBeUndefined();
    });
  });

  describe("Secret", () => {
    test("should encrypt device secret", async () => {
      await expect(handler.encryptSecret("secret")).resolves.not.toBe("secret");
    });

    test("should assert device secret", async () => {
      ctx.entity.device = new Device({
        accountId: "account-id",
        macAddress: "macAddress",
        name: "name",
        publicKey: "public-key",
        uniqueId: "uniqueId",
        secret: {
          signature: await handler.encryptSecret("secret"),
          updated: new Date(),
        },
      });

      await expect(handler.assertSecret("secret")).resolves.toBeUndefined();
    });
  });

  describe("Recovery Key", () => {
    test("should generate device recovery key", async () => {
      await expect(handler.generateRecoveryKey()).resolves.toStrictEqual("ABCD-EFGH-IJKL-MNOP-QRST-UVWX");
    });

    test("should encrypt device secret", async () => {
      await expect(handler.encryptRecoveryKey("ABCD-EFGH-IJKL-MNOP-QRST-UVWX")).resolves.not.toBe(
        "ABCD-EFGH-IJKL-MNOP-QRST-UVWX",
      );
    });

    test("should assert device recovery key", async () => {
      ctx.entity.device = new Device({
        accountId: "account-id",
        macAddress: "macAddress",
        name: "name",
        publicKey: "public-key",
        uniqueId: "uniqueId",
        recoveryKey: {
          signature: await handler.encryptRecoveryKey("recoveryKey"),
          updated: new Date(),
        },
      });

      await expect(handler.assertRecoveryKey("recoveryKey")).resolves.toBeUndefined();
    });
  });
});
