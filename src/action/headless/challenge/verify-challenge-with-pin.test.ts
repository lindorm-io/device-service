import MockDate from "mockdate";
import { ChallengeStrategy } from "../../../enum";
import { assertChallenge, assertDevicePIN } from "../../../support";
import { getTestDevice, logger } from "../../../test";
import { verifyChallengeWithPin } from "./verify-challenge-with-pin";

jest.mock("../../../support", () => ({
  assertChallenge: jest.fn(() => () => {}),
  assertDevicePIN: jest.fn(),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("verifyWithPin", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      device: getTestDevice({
        pin: null,
        secret: null,
      }),
      logger,
    };
  });

  test("should verify device challenge", async () => {
    await expect(
      verifyChallengeWithPin(ctx)({
        certificateVerifier: "certificateVerifier",
        challengeId: "eb14da97-6c96-4833-8046-54d1697d7a49",
        pin: "123456",
        strategy: ChallengeStrategy.PIN,
      }),
    ).resolves.toBe(undefined);

    expect(assertChallenge).toHaveBeenCalled();
    expect(assertDevicePIN).toHaveBeenCalled();
  });
});
