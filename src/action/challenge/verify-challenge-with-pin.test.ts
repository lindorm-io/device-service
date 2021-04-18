import MockDate from "mockdate";
import { ChallengeStrategy } from "../../enum";
import { getTestDevice, logger } from "../../test";
import { verifyChallengeWithPin } from "./verify-challenge-with-pin";

MockDate.set("2020-01-01 08:00:00.000");

describe("verifyChallengeWithPin", () => {
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
          assertDevicePIN: () => {},
        },
      },
      logger,
    };
  });

  test("should verify device challenge", async () => {
    await expect(
      verifyChallengeWithPin(ctx)({
        certificateVerifier: "certificateVerifier",
        pin: "123456",
        strategy: ChallengeStrategy.PIN,
      }),
    ).resolves.toMatchSnapshot();
  });
});
