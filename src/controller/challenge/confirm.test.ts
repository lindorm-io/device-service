import MockDate from "mockdate";
import { ChallengeStrategy } from "../../enum";
import { challengeConfirmController } from "./confirm";
import { getTestChallengeSession, getTestDevice } from "../../test";
import { updateDeviceMetadata as _updateDeviceMetadata } from "../../handler";
import { assertCertificateChallenge as _assertCertificateChallenge } from "../../util";

MockDate.set("2021-01-01T08:00:00.000Z");

const cryptoAssert = jest.fn();

jest.mock("../../instance", () => ({
  cryptoLayered: {
    encrypt: (arg: any) => `${arg}-signature`,
    assert: (...args: any) => cryptoAssert(...args),
  },
}));
jest.mock("../../handler", () => ({
  updateDeviceMetadata: jest.fn(),
}));
jest.mock("../../util", () => ({
  assertCertificateChallenge: jest.fn(),
}));

const updateDeviceMetadata = _updateDeviceMetadata as jest.Mock;
const assertCertificateChallenge = _assertCertificateChallenge as jest.Mock;

describe("challengeConfirmController", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      cache: {
        challengeSessionCache: {
          remove: jest.fn(),
        },
      },
      data: {
        certificateVerifier: "certificateVerifier",
        pincode: "pincode",
        biometry: "biometry",
        strategy: ChallengeStrategy.IMPLICIT,
      },
      entity: {
        challengeSession: getTestChallengeSession(),
        device: await getTestDevice(),
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
    };
  });

  afterEach(jest.clearAllMocks);

  test("should resolve challenge session with IMPLICIT", async () => {
    await expect(challengeConfirmController(ctx)).resolves.toStrictEqual({
      data: {
        challengeConfirmationToken: "jwt.jwt.jwt",
        expiresIn: 60,
      },
    });

    expect(assertCertificateChallenge).toHaveBeenCalledWith({
      certificateChallenge:
        "fU8ob4kqvPCfVCd5FdaM0hpXvpRoBx3VlPEWGarUP8DvTMj4AcFgieq2HMeH3uXK7MggvmLnG5iGGhUVMqDRhd7fRzW1XVveJe3CI7Pf3HlQpzqIOmrHGxes3yjZY3Es",
      certificateMethod: "sha512",
      certificateVerifier: "certificateVerifier",
      publicKey: ctx.entity.device.publicKey,
    });

    expect(cryptoAssert).not.toHaveBeenCalled();

    expect(updateDeviceMetadata).toHaveBeenCalled();

    expect(ctx.jwt.sign).toHaveBeenCalled();

    expect(ctx.cache.challengeSessionCache.remove).toHaveBeenCalled();
  });

  test("should resolve challenge session with PINCODE", async () => {
    ctx.data.strategy = ChallengeStrategy.PINCODE;

    await expect(challengeConfirmController(ctx)).resolves.toBeTruthy();

    expect(cryptoAssert).toHaveBeenCalledWith("pincode", "123456-signature");
  });

  test("should resolve challenge session with BIOMETRY", async () => {
    ctx.data.strategy = ChallengeStrategy.BIOMETRY;

    await expect(challengeConfirmController(ctx)).resolves.toBeTruthy();

    expect(cryptoAssert).toHaveBeenCalledWith(
      "biometry",
      "0KV2dMmKRp9xDHSmtJFsxblPg3xtCCq5n6q3EfrEA1XcYGfI9HPEX9w9GyQ949V3DEgntyGOW07OY2uPROxLd9YAmtFMZgfC0rIg18OdoKBmEa3gpWIvRAZ6J0pjsIHz-signature",
    );
  });
});
