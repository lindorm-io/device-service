import MockDate from "mockdate";
import { ChallengeStrategy } from "../../enum";
import { baseHash } from "@lindorm-io/core";
import { getTestDevice, getTestRepository, inMemoryStore, logger } from "../../test";
import { verifyChallengeWithRecoveryKey } from "./verify-challenge-with-recovery-key";

MockDate.set("2020-01-01 08:00:00.000");

describe("verifyChallengeWithRecoveryKey", () => {
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
          assertDeviceRecoveryKey: () => {},
          createDeviceRecoveryKey: () => "recoveryKey",
          encryptRecoveryKey: () => baseHash("recoveryKey"),
        },
      },
      logger,
      repository: await getTestRepository(),
    };

    await ctx.repository.deviceRepository.create(ctx.entity.device);
  });

  test("should verify device challenge", async () => {
    await expect(
      verifyChallengeWithRecoveryKey(ctx)({
        certificateVerifier: "certificateVerifier",
        recoveryKey: "ABCD-123456-ABCD-123456-ABCD",
        strategy: ChallengeStrategy.RECOVERY,
      }),
    ).resolves.toMatchSnapshot();

    expect(inMemoryStore).toMatchSnapshot();
  });
});
