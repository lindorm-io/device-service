import MockDate from "mockdate";
import { Device } from "../../entity";
import { assertDeviceChallenge } from "../../support";
import { verifyDeviceChallenge } from "./verify-device-challenge";
import { winston } from "../../logger";

jest.mock("../../support", () => ({
  assertDeviceChallenge: jest.fn(() => () => {}),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("verifyDeviceChallenge", () => {
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
      verifyDeviceChallenge(ctx)({
        deviceChallenge: "challenge",
        deviceVerifier: "verifier",
      }),
    ).resolves.toBe(undefined);

    expect(assertDeviceChallenge).toHaveBeenCalled();
  });
});
