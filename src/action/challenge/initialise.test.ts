import MockDate from "mockdate";
import { getTestDevice, logger } from "../../test";
import { initialiseChallenge } from "./initialise";
import { ChallengeScope, ChallengeStrategy } from "../../enum";

jest.mock("../../support", () => ({
  createChallenge: jest.fn(() => () => ({
    challengeId: "challengeId",
    certificateChallenge: "certificateChallenge",
    expires: "expires",
  })),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("initialiseChallenge", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      device: await getTestDevice({
        pin: null,
        recoveryKey: null,
        secret: null,
      }),
      logger,
    };
  });

  test("should initialise device challenge", async () => {
    await expect(
      initialiseChallenge(ctx)({
        scope: ChallengeScope.SIGN_IN,
        strategy: ChallengeStrategy.IMPLICIT,
      }),
    ).resolves.toMatchSnapshot();
  });
});
