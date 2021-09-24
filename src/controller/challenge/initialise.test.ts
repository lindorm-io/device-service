import MockDate from "mockdate";
import { challengeInitialiseController } from "./initialise";
import { getTestChallengeSession, getTestDevice } from "../../test";

MockDate.set("2021-01-01T08:00:00.000Z");

jest.mock("@lindorm-io/core", () => ({
  ...(jest.requireActual("@lindorm-io/core") as object),
  getRandomString: () => "random-value",
}));

describe("challengeInitialiseController", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      cache: {
        challengeSessionCache: {
          create: jest.fn().mockResolvedValue(getTestChallengeSession()),
        },
      },
      data: {
        nonce: "nonce",
        payload: { test: true },
        scope: "test",
      },
      entity: {
        device: await getTestDevice(),
      },
      jwt: {
        sign: jest.fn().mockImplementation(() => ({
          token: "jwt.jwt.jwt",
        })),
      },
      metadata: {
        client: {
          id: "clientId",
        },
      },
    };
  });

  test("should resolve challenge session", async () => {
    await expect(challengeInitialiseController(ctx)).resolves.toStrictEqual({
      body: {
        certificateChallenge: "random-value",
        challengeSessionToken: "jwt.jwt.jwt",
        expiresIn: 180,
        strategies: ["implicit", "biometry", "pincode"],
      },
    });

    expect(ctx.jwt.sign).toHaveBeenCalled();

    expect(ctx.cache.challengeSessionCache.create).toHaveBeenCalledWith(
      expect.objectContaining({
        certificateChallenge: "random-value",
        deviceId: expect.any(String),
        nonce: "nonce",
        payload: { test: true },
        scopes: ["test"],
        strategies: ["implicit", "biometry", "pincode"],
      }),
      180,
    );
  });
});
