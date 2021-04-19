import MockDate from "mockdate";
import { getTestDevice, logger } from "../../test";
import { initialiseChallenge } from "./initialise";
import { ChallengeScope, ChallengeStrategy } from "../../enum";

MockDate.set("2020-01-01 08:00:00.000");

describe("initialiseChallenge", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      entity: {
        device: await getTestDevice({
          pin: null,
          recoveryKey: null,
          secret: null,
        }),
      },
      handler: {
        challengeHandler: {
          create: () => ({
            challengeId: "challengeId",
            certificateChallenge: "certificateChallenge",
            expires: "expires",
          }),
        },
      },
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
