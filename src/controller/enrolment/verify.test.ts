import MockDate from "mockdate";
import { enrolmentVerify } from "./verify";
import { logger } from "../../test";

MockDate.set("2021-01-01T08:00:00.000Z");

const deviceAssert = jest.fn();

jest.mock("../../crypto", () => ({
  cryptoLayered: {
    encrypt: (arg: any) => `${arg}-signature`,
  },
}));
jest.mock("../../util", () => ({
  generateRecoveryKey: () => "recovery-key",
}));
jest.mock("@lindorm-io/crypto", () => ({
  CryptoError: class CryptoError {},
  CryptoKeyPair: class CryptoKeyPair {
    constructor() {}
    async assert(...args: any) {
      deviceAssert(...args);
    }
  },
}));

describe("enrolmentVerify", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      cache: {
        enrolmentSessionCache: {
          remove: jest.fn(),
        },
      },
      entity: {
        enrolmentSession: {
          id: "enrolmentSessionId",
          accountId: "accountId",
          certificateChallenge: "certificateChallenge",
          macAddress: "macAddress",
          name: "name",
          publicKey: "publicKey",
          uniqueId: "uniqueId",
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
      repository: {
        deviceRepository: {
          create: jest.fn().mockResolvedValue({
            id: "deviceId",
          }),
        },
      },
      request: {
        body: {
          biometry: "biometry",
          certificateVerifier: "certificateVerifier",
          pincode: "pincode",
        },
      },
      token: {
        bearerToken: {
          subject: "accountId",
        },
      },
    };
  });

  afterEach(jest.clearAllMocks);

  test("should resolve enrolment session with implicit strategy", async () => {
    await expect(enrolmentVerify(ctx)).resolves.toStrictEqual({
      body: {
        challengeConfirmationToken: "jwt.jwt.jwt",
        deviceId: "deviceId",
        expiresIn: 60,
        recoveryKey: "recovery-key",
      },
      status: 201,
    });

    expect(deviceAssert).toHaveBeenCalledWith("certificateChallenge", "certificateVerifier");
    expect(ctx.repository.deviceRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId: "accountId",
        biometry: "biometry-signature",
        macAddress: "macAddress",
        name: "name",
        pincode: "pincode-signature",
        publicKey: "publicKey",
        recoveryKey: "recovery-key-signature",
        uniqueId: "uniqueId",
      }),
    );
    expect(ctx.jwt.sign).toHaveBeenCalledWith({
      id: "enrolmentSessionId",
      audience: "challenge_confirmation",
      clientId: "clientId",
      deviceId: "deviceId",
      expiry: "10 minutes",
      scope: ["enrolment"],
      subject: "accountId",
    });
    expect(ctx.cache.enrolmentSessionCache.remove).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "enrolmentSessionId",
      }),
    );
  });
});
