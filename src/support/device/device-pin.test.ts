import { Device } from "../../entity";
import { assertDevicePIN, encryptDevicePIN } from "./device-pin";

describe("encryptDevicePIN", () => {
  test("should resolve", async () => {
    await expect(encryptDevicePIN("secret")).resolves.not.toBe("secret");
  });
});

describe("assertDevicePIN", () => {
  test("should resolve", async () => {
    const device = new Device({
      accountId: "account-id",
      publicKey: "public-key",
      pin: {
        signature: await encryptDevicePIN("secret"),
        updated: new Date(),
      },
    });
    await expect(assertDevicePIN(device, "secret")).resolves.toBe(undefined);
  });
});
