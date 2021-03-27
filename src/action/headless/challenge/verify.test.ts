import MockDate from "mockdate";
import { assertChallenge } from "../../../support";
import { getTestDevice, logger } from "../../../test";
import { verifyChallenge } from "./verify";
import { ChallengeStrategy } from "../../../enum";

jest.mock("../../../support", () => ({
  assertChallenge: jest.fn(() => () => {}),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("verifyCertificateChallenge", () => {
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
      verifyChallenge(ctx)({
        certificateVerifier: "certificateVerifier",
        challengeId: "eb14da97-6c96-4833-8046-54d1697d7a49",
        strategy: ChallengeStrategy.IMPLICIT,
      }),
    ).resolves.toBe(undefined);

    expect(assertChallenge).toHaveBeenCalled();
  });
});
