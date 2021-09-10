import { getTestChallengeSession } from "../../test";
import { challengeRejectController } from "./reject";

describe("challengeRejectController", () => {
  let ctx: any;

  beforeEach(() => {
    ctx = {
      cache: {
        challengeSessionCache: {
          remove: jest.fn(),
        },
      },
      entity: {
        challengeSession: getTestChallengeSession(),
      },
    };
  });

  test("should resolve with removed session", async () => {
    await expect(challengeRejectController(ctx)).resolves.toBeTruthy();

    expect(ctx.cache.challengeSessionCache.remove).toHaveBeenCalled();
  });
});
