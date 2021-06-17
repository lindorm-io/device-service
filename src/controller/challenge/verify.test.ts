import MockDate from "mockdate";
import { challengeVerify } from "./verify";
import { logger } from "../../test";
import { ClientError } from "@lindorm-io/errors";
import { ChallengeStrategy } from "../../enum";

MockDate.set("2021-01-01T08:00:00.000Z");

const deviceAssert = jest.fn();
const strategyAssert = jest.fn();

jest.mock("../../crypto", () => ({
  cryptoLayered: {
    assert: (...args: any) => strategyAssert(...args),
  },
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

describe("challengeVerify", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      cache: {
        challengeSessionCache: {
          remove: jest.fn(),
        },
      },
      entity: {
        challengeSession: {
          id: "challengeSessionId",
          certificateChallenge: "certificateChallenge",
          scope: ["scope"],
          strategies: [
            ChallengeStrategy.IMPLICIT,
            ChallengeStrategy.PINCODE,
            ChallengeStrategy.RECOVERY,
            ChallengeStrategy.SECRET,
          ],
        },
        device: {
          id: "deviceId",
          accountId: "accountId",
          pincode: "pin-signature",
          publicKey: "publicKey",
          recoveryKey: "recovery-key-signature",
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
      metadata: { clientId: "clientId" },
      request: {
        body: {
          certificateVerifier: "certificateVerifier",
          pincode: "pincode",
          recoveryKey: "recoveryKey",
          secret: "secret",
          strategy: ChallengeStrategy.IMPLICIT,
        },
      },
    };
  });

  afterEach(jest.clearAllMocks);

  test("should resolve challenge session with implicit strategy", async () => {
    await expect(challengeVerify(ctx)).resolves.toStrictEqual({
      body: {
        challengeConfirmationToken: "jwt.jwt.jwt",
        expires: 600,
        expiresIn: 60,
      },
      status: 200,
    });

    expect(deviceAssert).toHaveBeenCalledWith("certificateChallenge", "certificateVerifier");
    expect(ctx.jwt.sign).toHaveBeenCalledWith({
      audience: "challenge_confirmation",
      clientId: "clientId",
      deviceId: "deviceId",
      expiry: "10 minutes",
      id: "challengeSessionId",
      scope: ["scope"],
      subject: "accountId",
    });
    expect(ctx.cache.challengeSessionCache.remove).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "challengeSessionId",
      }),
    );
  });

  test("should resolve challenge session with pincode strategy", async () => {
    ctx.request.body.strategy = ChallengeStrategy.PINCODE;

    await expect(challengeVerify(ctx)).resolves.toStrictEqual({
      body: {
        challengeConfirmationToken: "jwt.jwt.jwt",
        expires: 600,
        expiresIn: 60,
      },
      status: 200,
    });

    expect(strategyAssert).toHaveBeenCalledWith("pincode", "pin-signature");
  });

  test("should resolve challenge session with recovery strategy", async () => {
    ctx.request.body.strategy = ChallengeStrategy.RECOVERY;

    await expect(challengeVerify(ctx)).resolves.toStrictEqual({
      body: {
        challengeConfirmationToken: "jwt.jwt.jwt",
        expires: 600,
        expiresIn: 60,
      },
      status: 200,
    });

    expect(strategyAssert).toHaveBeenCalledWith("recoveryKey", "recovery-key-signature");
  });

  test("should resolve challenge session with secret strategy", async () => {
    ctx.request.body.strategy = ChallengeStrategy.SECRET;

    await expect(challengeVerify(ctx)).resolves.toStrictEqual({
      body: {
        challengeConfirmationToken: "jwt.jwt.jwt",
        expires: 600,
        expiresIn: 60,
      },
      status: 200,
    });

    expect(strategyAssert).toHaveBeenCalledWith("secret", "secret-signature");
  });

  test("should throw on invalid strategy", async () => {
    ctx.entity.challengeSession.strategies = [ChallengeStrategy.IMPLICIT];
    ctx.request.body.strategy = ChallengeStrategy.PINCODE;

    await expect(challengeVerify(ctx)).rejects.toThrow(ClientError);
  });
});
