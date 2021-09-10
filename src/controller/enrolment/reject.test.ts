import { getTestEnrolmentSession } from "../../test";
import { enrolmentRejectController } from "./reject";

describe("enrolmentRejectController", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      cache: {
        enrolmentSessionCache: {
          remove: jest.fn(),
        },
      },
      entity: {
        enrolmentSession: getTestEnrolmentSession(),
      },
    };
  });

  test("should resolve with removed session", async () => {
    await expect(enrolmentRejectController(ctx)).resolves.toBeTruthy();

    expect(ctx.cache.enrolmentSessionCache.remove).toHaveBeenCalled();
  });
});
