import MockDate from "mockdate";
import { ChallengeStrategy } from "../../enum";
import { getTestDevice, logger } from "../../test";
import { verifyChallengeWithSecret } from "./verify-challenge-with-secret";

MockDate.set("2020-01-01 08:00:00.000");

describe("verifyChallengeWithSecret", () => {
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
          assertChallenge: () => {},
          getChallengeConfirmationToken: () => "getChallengeConfirmationToken",
        },
        deviceHandler: {
          assertDeviceSecret: () => {},
        },
      },
      logger,
    };
  });

  test("should verify device challenge", async () => {
    await expect(
      verifyChallengeWithSecret(ctx)({
        certificateVerifier: "certificateVerifier",
        secret: "secret",
        strategy: ChallengeStrategy.SECRET,
      }),
    ).resolves.toMatchSnapshot();
  });
});
