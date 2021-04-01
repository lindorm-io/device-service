import MockDate from "mockdate";
import { getChallengeConfirmationToken } from "./challenge-confirmation";
import { getTestChallenge, getTestDevice, getTestDeviceIssuer, logger } from "../../test";

jest.mock("jsonwebtoken", () => ({
  sign: (data: any) => data,
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("getChallengeConfirmationToken", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      challenge: getTestChallenge({}),
      device: await getTestDevice({
        pin: null,
        recoveryKey: null,
        secret: null,
      }),
      issuer: { device: getTestDeviceIssuer() },
      logger,
      metadata: { clientId: "clientId" },
    };
  });

  test("should return a challenge confirmation token", () => {
    expect(getChallengeConfirmationToken(ctx)()).toMatchSnapshot();
  });
});
