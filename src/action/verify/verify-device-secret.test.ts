import MockDate from "mockdate";
import { Device } from "../../entity";
import { assertAccountPermission, assertDeviceChallenge, assertDeviceSecret } from "../../support";
import { verifyDeviceSecret } from "./verify-device-secret";
import { winston } from "../../logger";

jest.mock("../../support", () => ({
  assertAccountPermission: jest.fn(() => () => {}),
  assertDeviceChallenge: jest.fn(() => () => {}),
  assertDeviceSecret: jest.fn(() => () => {}),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("verifyDeviceSecret", () => {
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
      verifyDeviceSecret(ctx)({
        challenge: "challenge",
        verifier: "verifier",
        secret: "secret",
      }),
    ).resolves.toBe(undefined);

    expect(assertAccountPermission).toHaveBeenCalled();
    expect(assertDeviceChallenge).toHaveBeenCalled();
    expect(assertDeviceSecret).toHaveBeenCalled();
  });
});
