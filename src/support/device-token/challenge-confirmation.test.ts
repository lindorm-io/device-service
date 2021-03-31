import MockDate from "mockdate";
import { Challenge, Device } from "../../entity";
import { ChallengeScope } from "../../enum";
import { getChallengeConfirmationToken } from "./challenge-confirmation";
import { getTestChallenge, getTestDevice, getTestDeviceIssuer, logger } from "../../test";

jest.mock("jsonwebtoken", () => ({
  sign: (data: any) => data,
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("getChallengeConfirmationToken", () => {
  let ctx: any;
  let challenge: Challenge;
  let device: Device;

  beforeEach(async () => {
    ctx = {
      issuer: { device: getTestDeviceIssuer() },
      logger,
      metadata: { clientId: "clientId" },
    };

    challenge = getTestChallenge({});
    device = await getTestDevice({
      pin: null,
      recoveryKey: null,
      secret: null,
    });
  });

  test("should return a challenge confirmation token", () => {
    expect(
      getChallengeConfirmationToken(ctx)({
        challenge,
        device,
        scope: ChallengeScope.SIGN_IN,
      }),
    ).toMatchSnapshot();
  });
});
