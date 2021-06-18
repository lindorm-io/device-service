import { assertBearerToDevice } from "./assert-bearer-to-device";

describe("assertBearerToDevice", () => {
  let bearerToken: any;
  let device: any;

  beforeEach(() => {
    bearerToken = {
      subject: "accountId",
    };
    device = {
      accountId: "accountId",
    };
  });

  test("should assert bearer token", () => {
    expect(assertBearerToDevice(bearerToken, device)).toBeUndefined();
  });
});
