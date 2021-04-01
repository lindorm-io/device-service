import MockDate from "mockdate";
import { ChallengeStrategy } from "../../enum";
import { assertChallenge, assertDeviceSecret, getChallengeConfirmationToken } from "../../support";
import { getTestDevice, logger } from "../../test";
import { verifyChallengeWithSecret } from "./verify-challenge-with-secret";

jest.mock("../../support", () => ({
  assertChallenge: jest.fn(() => () => {}),
  assertDeviceSecret: jest.fn(),
  getChallengeConfirmationToken: jest.fn(() => () => "getChallengeConfirmationToken"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("verifyChallengeWithSecret", () => {
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

  test("should verify device challenge", async () => {
    await expect(
      verifyChallengeWithSecret(ctx)({
        certificateVerifier: "certificateVerifier",
        secret: "secret",
        strategy: ChallengeStrategy.SECRET,
      }),
    ).resolves.toMatchSnapshot();

    expect(assertChallenge).toHaveBeenCalled();
    expect(assertDeviceSecret).toHaveBeenCalled();
    expect(getChallengeConfirmationToken).toHaveBeenCalled();
  });
});
