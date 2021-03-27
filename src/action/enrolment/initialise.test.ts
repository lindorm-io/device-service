import MockDate from "mockdate";
import { initialiseEnrolment } from "./initialise";
import { logger } from "../../test";

jest.mock("../../support", () => ({
  createEnrolment: jest.fn(() => () => ({
    id: "a89b62b8-9956-4b0e-986c-e83b4e66c2ec",
    certificateChallenge: "certificateChallenge",
    expires: "expires",
  })),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("initialiseEnrolment", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      logger,
      token: { bearer: { subject: "42667d2b-265b-4424-bad0-1be10960a28c" } },
    };
  });

  test("should initialise device challenge", async () => {
    await expect(
      initialiseEnrolment(ctx)({
        macAddress: "00:00:0A:BB:28:FC",
        name: "My iPhone 11 Pro",
        publicKey: "publicKey",
        uniqueId: "472704d28e5c4187b841",
      }),
    ).resolves.toMatchSnapshot();
  });
});
