import MockDate from "mockdate";
import { ChallengeStrategy } from "../../enum";
import { baseHash } from "@lindorm-io/core";
import { getTestDevice, getTestRepository, inMemoryStore, logger } from "../../test";
import { verifyChallengeWithRecoveryKey } from "./verify-challenge-with-recovery-key";

jest.mock("../../support", () => ({
  assertChallenge: jest.fn(() => () => {}),
  assertDeviceRecoveryKey: jest.fn(),
  createDeviceRecoveryKeys: jest.fn(() => ({
    recoveryKeys: ["key1"],
    signatures: [baseHash("key1")],
  })),
  getChallengeConfirmationToken: jest.fn(() => () => "getChallengeConfirmationToken"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("verifyChallengeWithRecoveryKey", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      device: await getTestDevice({
        pin: null,
        recoveryKey: null,
        secret: null,
      }),
      logger,
      repository: await getTestRepository(),
    };

    await ctx.repository.device.create(ctx.device);
  });

  test("should verify device challenge", async () => {
    await expect(
      verifyChallengeWithRecoveryKey(ctx)({
        certificateVerifier: "certificateVerifier",
        challengeId: "eb14da97-6c96-4833-8046-54d1697d7a49",
        recoveryKey: "123456-123456-123456",
        strategy: ChallengeStrategy.RECOVERY,
      }),
    ).resolves.toMatchSnapshot();

    expect(inMemoryStore).toMatchSnapshot();
  });
});
