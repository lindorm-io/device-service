import MockDate from "mockdate";
import { ChallengeController } from "./ChallengeController";
import { ChallengeScope, ChallengeStrategy } from "../../enum";
import { getTestContext, inMemoryStore, resetAll } from "../../test";

MockDate.set("2020-01-01 08:00:00.000");

describe("ChallengeController", () => {
  let ctx: any;
  let controller: ChallengeController;

  beforeEach(async () => {
    ctx = { ...(await getTestContext()) };
    await ctx.repository.deviceRepository.create(ctx.entity.device);

    controller = new ChallengeController(ctx);
  });

  afterEach(resetAll);

  describe("initialise", () => {
    test("should initialise device challenge", async () => {
      await expect(
        controller.initialise({
          scope: ChallengeScope.SIGN_IN,
          strategy: ChallengeStrategy.IMPLICIT,
        }),
      ).resolves.toMatchSnapshot();
    });
  });

  describe("verifyImplicit", () => {
    test("should verify device challenge", async () => {
      await expect(
        controller.verifyImplicit({
          certificateVerifier: "certificateVerifier",
          strategy: ChallengeStrategy.IMPLICIT,
        }),
      ).resolves.toMatchSnapshot();
    });
  });

  describe("verifyPin", () => {
    test("should verify device challenge with pin", async () => {
      await expect(
        controller.verifyPin({
          certificateVerifier: "certificateVerifier",
          pin: "123456",
          strategy: ChallengeStrategy.PIN,
        }),
      ).resolves.toMatchSnapshot();
    });
  });

  describe("verifyRecoveryKey", () => {
    test("should verify device challenge with recovery key", async () => {
      await expect(
        controller.verifyRecoveryKey({
          certificateVerifier: "certificateVerifier",
          recoveryKey: "ABCD-123456-ABCD-123456-ABCD",
          strategy: ChallengeStrategy.RECOVERY,
        }),
      ).resolves.toMatchSnapshot();

      expect(inMemoryStore).toMatchSnapshot();
    });
  });

  describe("verifySecret", () => {
    test("should verify device challenge", async () => {
      await expect(
        controller.verifySecret({
          certificateVerifier: "certificateVerifier",
          secret: "secret",
          strategy: ChallengeStrategy.SECRET,
        }),
      ).resolves.toMatchSnapshot();
    });
  });
});
