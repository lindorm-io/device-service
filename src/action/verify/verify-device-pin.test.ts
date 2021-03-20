import MockDate from "mockdate";
import { Device } from "../../entity";
import { assertDeviceChallenge, assertDevicePIN } from "../../support";
import { verifyDevicePIN } from "./verify-device-pin";
import { winston } from "../../logger";

jest.mock("../../support", () => ({
  assertDeviceChallenge: jest.fn(() => () => {}),
  assertDevicePIN: jest.fn(() => () => {}),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("verifyDevicePIN", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      device: new Device({
        id: "d7230fc6-322f-44d9-9ef6-b2abba9ad6a4",
        accountId: "eaf6491b-d3c5-4122-b246-5a28cbe2ff3c",
        publicKey: "publicKey",
      }),
      logger: winston,
    };
  });

  test("should verify device challenge", async () => {
    await expect(
      verifyDevicePIN(ctx)({
        deviceChallenge: "challenge",
        deviceVerifier: "verifier",
        pin: "123456",
      }),
    ).resolves.toBe(undefined);

    expect(assertDeviceChallenge).toHaveBeenCalled();
    expect(assertDevicePIN).toHaveBeenCalled();
  });
});
