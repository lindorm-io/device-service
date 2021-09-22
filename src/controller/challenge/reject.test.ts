import { challengeRejectController } from "./reject";
import { getTestChallengeSession } from "../../test";

describe("challengeRejectController", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      cache: {
        challengeSessionCache: {
          destroy: jest.fn(),
        },
      },
      entity: {
        challengeSession: getTestChallengeSession(),
      },
    };
  });

  test("should resolve with removed session", async () => {
    await expect(challengeRejectController(ctx)).resolves.toBeTruthy();

    expect(ctx.cache.challengeSessionCache.destroy).toHaveBeenCalled();
  });
});
