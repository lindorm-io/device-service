import MockDate from "mockdate";
import { EnrolmentController } from "./EnrolmentController";
import { getTestContext, resetAll } from "../../test";

MockDate.set("2021-01-01T08:00:00.000Z");

describe("EnrolmentController", () => {
  let ctx: any;
  let controller: EnrolmentController;

  beforeEach(async () => {
    ctx = {
      ...(await getTestContext()),
      token: {
        bearer: {
          subject: "subject",
        },
      },
    };
    controller = new EnrolmentController(ctx);
  });

  afterEach(resetAll);

  describe("initialise", () => {
    test("should initialise device enrolment", async () => {
      await expect(
        controller.initialise({
          macAddress: "00:00:0A:BB:28:FC",
          name: "My iPhone 11 Pro",
          publicKey: "publicKey",
          uniqueId: "472704d28e5c4187b841",
        }),
      ).resolves.toMatchSnapshot();
    });
  });

  describe("verify", () => {
    test("should verify device enrolment", async () => {
      await expect(
        controller.verify({
          certificateVerifier: "verifier",
          enrolmentId: "ef2014be-f0e2-4a0c-9719-4f694eca8f37",
          pin: "123456",
          secret: "secret",
        }),
      ).resolves.toMatchSnapshot();
    });
  });
});
