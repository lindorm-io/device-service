import MockDate from "mockdate";
import { enrolmentInitialise } from "./initialise";
import { logger } from "../../test";

MockDate.set("2021-01-01T08:00:00.000Z");

jest.mock("@lindorm-io/core", () => ({
  ...(jest.requireActual("@lindorm-io/core") as object),
  getRandomValue: () => "random-value",
}));

describe("enrolmentInitialise", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      cache: {
        enrolmentSessionCache: {
          create: jest.fn().mockImplementation(() => ({
            certificateChallenge: "certificateChallenge",
          })),
        },
      },
      jwt: {
        sign: jest.fn().mockImplementation(() => ({
          id: "tokenId",
          expiresIn: 60,
          token: "jwt.jwt.jwt",
        })),
      },
      logger,
      metadata: { clientId: "clientId" },
      request: {
        body: {
          macAddress: "macAddress",
          name: "name",
          publicKey: "publicKey",
          uniqueId: "uniqueId",
        },
      },
      token: {
        bearerToken: {
          subject: "accountId",
        },
      },
    };
  });

  test("should resolve enrolment session", async () => {
    await expect(enrolmentInitialise(ctx)).resolves.toStrictEqual({
      body: {
        certificateChallenge: "certificateChallenge",
        enrolmentSessionToken: "jwt.jwt.jwt",
        expiresIn: 60,
      },
      status: 200,
    });

    expect(ctx.jwt.sign).toHaveBeenCalledWith({
      audience: "enrolment_session",
      clientId: "clientId",
      expiry: "5 minutes",
      subject: "accountId",
    });
    expect(ctx.cache.enrolmentSessionCache.create).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId: "accountId",
        certificateChallenge: "random-value",
        id: "tokenId",
        macAddress: "macAddress",
        name: "name",
        publicKey: "publicKey",
        uniqueId: "uniqueId",
      }),
      60,
    );
  });
});
