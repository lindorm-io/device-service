import MockDate from "mockdate";
import { enrolmentConfirmController } from "./confirm";
import { assertCertificateChallenge as _assertCertificateChallenge } from "../../util";
import { getTestEnrolmentSession } from "../../test";

MockDate.set("2021-01-01T08:00:00.000Z");

jest.mock("../../instance", () => ({
  cryptoLayered: {
    encrypt: (arg: any) => `${arg}-signature`,
  },
}));

jest.mock("../../util", () => ({
  assertCertificateChallenge: jest.fn(),
}));

const assertCertificateChallenge = _assertCertificateChallenge as jest.Mock;

describe("enrolmentConfirmController", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      cache: {
        enrolmentSessionCache: {
          destroy: jest.fn(),
        },
      },
      data: {
        biometry: "biometry",
        certificateVerifier: "certificateVerifier",
        pincode: "pincode",
      },
      entity: {
        enrolmentSession: getTestEnrolmentSession(),
      },
      jwt: {
        sign: jest.fn().mockImplementation(() => ({
          expiresIn: 60,
          token: "jwt.jwt.jwt",
        })),
      },
      metadata: {
        client: {
          id: "clientId",
        },
      },
      repository: {
        deviceRepository: {
          create: jest.fn().mockImplementation(async (arg: any) => arg),
        },
      },
      token: {
        bearerToken: {
          subject: "identityId",
        },
      },
    };
  });

  afterEach(jest.clearAllMocks);

  test("should resolve enrolment session with implicit strategy", async () => {
    await expect(enrolmentConfirmController(ctx)).resolves.toStrictEqual({
      data: {
        challengeConfirmationToken: "jwt.jwt.jwt",
        deviceId: expect.any(String),
        expiresIn: 60,
      },
    });

    expect(assertCertificateChallenge).toHaveBeenCalledWith({
      certificateChallenge:
        "fU8ob4kqvPCfVCd5FdaM0hpXvpRoBx3VlPEWGarUP8DvTMj4AcFgieq2HMeH3uXK7MggvmLnG5iGGhUVMqDRhd7fRzW1XVveJe3CI7Pf3HlQpzqIOmrHGxes3yjZY3Es",
      certificateMethod: "sha512",
      certificateVerifier: "certificateVerifier",
      publicKey: expect.any(String),
    });

    expect(ctx.repository.deviceRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        biometry: "biometry-signature",
        certificateMethod: "sha512",
        identityId: "identityId",
        installationId: expect.any(String),
        macAddress: "0B:ED:A0:D5:5A:2D",
        name: "Test Device Name",
        os: "iPhone OS",
        pincode: "pincode-signature",
        platform: "iPhone",
        publicKey: expect.any(String),
        uniqueId: "27a10522a6994bbca0e1fc666804b350",
      }),
    );

    expect(ctx.jwt.sign).toHaveBeenCalled();

    expect(ctx.cache.enrolmentSessionCache.destroy).toHaveBeenCalled();
  });
});
