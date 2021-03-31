import MockDate from "mockdate";
import { ChallengeStrategy } from "../../../enum";
import { assertChallenge, getChallengeConfirmationToken } from "../../../support";
import { getTestDevice, logger } from "../../../test";
import { verifyChallengeImplicit } from "./verify-challenge-implicit";

jest.mock("../../../support", () => ({
  assertChallenge: jest.fn(() => () => {}),
  getChallengeConfirmationToken: jest.fn(() => () => "getChallengeConfirmationToken"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("verifyCertificateChallenge", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      device: getTestDevice({
        pin: null,
        recoveryKey: null,
        secret: null,
      }),
      logger,
    };
  });

  test("should verify device challenge", async () => {
    await expect(
      verifyChallengeImplicit(ctx)({
        certificateVerifier: "certificateVerifier",
        challengeId: "eb14da97-6c96-4833-8046-54d1697d7a49",
        strategy: ChallengeStrategy.IMPLICIT,
      }),
    ).resolves.toMatchSnapshot();

    expect(assertChallenge).toHaveBeenCalled();
    expect(getChallengeConfirmationToken).toHaveBeenCalled();
  });
});
