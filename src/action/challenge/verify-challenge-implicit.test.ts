import MockDate from "mockdate";
import { ChallengeStrategy } from "../../enum";
import { getTestDevice, logger } from "../../test";
import { verifyChallengeImplicit } from "./verify-challenge-implicit";

MockDate.set("2020-01-01 08:00:00.000");

describe("verifyChallengeImplicit", () => {
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
          assert: () => {},
          getConfirmationToken: () => "getConfirmationToken",
        },
      },
      logger,
    };
  });

  test("should verify device challenge", async () => {
    await expect(
      verifyChallengeImplicit(ctx)({
        certificateVerifier: "certificateVerifier",
        strategy: ChallengeStrategy.IMPLICIT,
      }),
    ).resolves.toMatchSnapshot();
  });
});
