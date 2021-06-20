import MockDate from "mockdate";
import { ClientError } from "@lindorm-io/errors";
import { challengeInitialise } from "./initialise";
import { logger } from "../../test";

MockDate.set("2021-01-01T08:00:00.000Z");

jest.mock("@lindorm-io/core", () => ({
  ...(jest.requireActual("@lindorm-io/core") as object),
  getRandomValue: () => "random-value",
}));

describe("challengeInitialise", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      cache: {
        challengeSessionCache: {
          create: jest.fn().mockImplementation(() => ({
            certificateChallenge: "certificateChallenge",
          })),
        },
      },
      entity: {
        device: {
          id: "deviceId",
          accountId: "accountId",
          pincode: "pincode-signature",
          secret: "secret-signature",
        },
      },
      jwt: {
        sign: jest.fn().mockImplementation(() => ({
          id: "tokenId",
          expires: 600,
          expiresIn: 60,
          token: "jwt.jwt.jwt",
        })),
      },
      logger,
      metadata: { clientId: "clientId", deviceId: "deviceId" },
      request: {
        body: {
          accountId: "accountId",
          payload: { data: true },
          scope: "sign_in",
        },
      },
    };
  });

  test("should resolve challenge session", async () => {
    await expect(challengeInitialise(ctx)).resolves.toStrictEqual({
      body: {
        certificateChallenge: "certificateChallenge",
        challengeSessionToken: "jwt.jwt.jwt",
        expires: 600,
        expiresIn: 60,
        strategies: ["implicit", "recovery", "pincode", "secret"],
      },
      status: 200,
    });

    expect(ctx.jwt.sign).toHaveBeenCalledWith({
      audience: "challenge_session",
      clientId: "clientId",
      deviceId: "deviceId",
      expiry: "5 minutes",
      subject: "accountId",
    });
    expect(ctx.cache.challengeSessionCache.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "tokenId",
        certificateChallenge: "random-value",
        deviceId: "deviceId",
        payload: { data: true },
        scope: ["sign_in"],
        strategies: ["implicit", "recovery", "pincode", "secret"],
      }),
      60,
    );
  });

  test("should throw on mismatched accountId", async () => {
    ctx.request.body.accountId = "wrong";

    await expect(challengeInitialise(ctx)).rejects.toThrow(ClientError);
  });
});
