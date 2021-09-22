import MockDate from "mockdate";
import { enrolmentInitialiseController } from "./initialise";

MockDate.set("2021-01-01T08:00:00.000Z");

jest.mock("@lindorm-io/core", () => ({
  ...(jest.requireActual("@lindorm-io/core") as object),
  getRandomString: () => "random-value",
}));

describe("enrolmentInitialiseController", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      cache: {
        enrolmentSessionCache: {
          create: jest.fn().mockImplementation(async (arg: any) => arg),
        },
      },
      data: {
        certificateMethod: "certificateMethod",
        macAddress: "macAddress",
        publicKey: "publicKey",
      },
      jwt: {
        sign: jest.fn().mockImplementation(() => ({
          token: "jwt.jwt.jwt",
        })),
      },
      metadata: {
        agent: {
          os: "os",
          platform: "platform",
        },
        client: {
          id: "clientId",
        },
        device: {
          installationId: "installationId",
          name: "name",
          uniqueId: "uniqueId",
        },
      },
      token: {
        bearerToken: {
          subject: "identityId",
        },
      },
    };
  });

  test("should resolve enrolment session", async () => {
    await expect(enrolmentInitialiseController(ctx)).resolves.toStrictEqual({
      data: {
        certificateChallenge: "random-value",
        enrolmentSessionToken: "jwt.jwt.jwt",
        expiresIn: 180,
      },
    });

    expect(ctx.cache.enrolmentSessionCache.create).toHaveBeenCalledWith(
      expect.objectContaining({
        certificateChallenge: "random-value",
        certificateMethod: "certificateMethod",
        identityId: "identityId",
        installationId: "installationId",
        macAddress: "macAddress",
        name: "name",
        os: "os",
        platform: "platform",
        publicKey: "publicKey",
        uniqueId: "uniqueId",
      }),
      180,
    );

    expect(ctx.jwt.sign).toHaveBeenCalled();
  });
});
