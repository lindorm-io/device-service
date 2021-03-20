import { Device } from "../../entity";
import { assertDeviceSecret, encryptDeviceSecret } from "./device-secret";

describe("encryptDeviceSecret", () => {
  test("should resolve", async () => {
    await expect(encryptDeviceSecret("secret")).resolves.not.toBe("secret");
  });
});

describe("assertDeviceSecret", () => {
  test("should resolve", async () => {
    const device = new Device({
      accountId: "account-id",
      publicKey: "public-key",
      secret: {
        signature: await encryptDeviceSecret("secret"),
        updated: new Date(),
      },
    });
    await expect(assertDeviceSecret(device, "secret")).resolves.toBe(undefined);
  });
});
