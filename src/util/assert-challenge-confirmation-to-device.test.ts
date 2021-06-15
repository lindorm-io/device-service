import { assertChallengeConfirmationToDevice } from "./assert-challenge-confirmation-to-device";

describe("assertChallengeConfirmationToDevice", () => {
  let challengeConfirmationToken: any;
  let device: any;

  beforeEach(() => {
    challengeConfirmationToken = {
      scope: ["change"],
      subject: "accountId",
    };
    device = {
      accountId: "accountId",
    };
  });

  test("should assert bearer token", () => {
    expect(assertChallengeConfirmationToDevice(challengeConfirmationToken, device)).toBeUndefined();
  });
});
