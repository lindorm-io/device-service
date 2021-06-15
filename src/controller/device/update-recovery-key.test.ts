import MockDate from "mockdate";
import { logger } from "../../test";
import { deviceUpdateRecoveryKey } from "./update-recovery-key";
import {
  assertBearerToDevice as _assertBearerToDevice,
  assertChallengeConfirmationToDevice as _assertChallengeConfirmationToDevice,
} from "../../util";

MockDate.set("2021-01-01T08:00:00.000Z");

jest.mock("../../crypto", () => ({
  cryptoLayered: {
    encrypt: (arg: any) => arg,
  },
}));
jest.mock("../../util", () => ({
  assertBearerToDevice: jest.fn(),
  assertChallengeConfirmationToDevice: jest.fn(),
  generateRecoveryKey: () => "generatedRecoveryKey",
}));

const assertBearerToDevice = _assertBearerToDevice as unknown as jest.Mock;
const assertChallengeConfirmationToDevice = _assertChallengeConfirmationToDevice as unknown as jest.Mock;

describe("deviceUpdateRecoveryKey", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      entity: {
        device: { id: "deviceId", accountId: "accountId" },
      },
      logger,
      repository: {
        deviceRepository: { update: jest.fn() },
      },
      token: {
        bearerToken: "bearerToken",
        challengeConfirmationToken: "challengeConfirmationToken",
      },
    };
  });

  test("should resolve and remove device", async () => {
    await expect(deviceUpdateRecoveryKey(ctx)).resolves.toStrictEqual({
      body: {
        recoveryKey: "generatedRecoveryKey",
      },
      status: 200,
    });

    expect(assertBearerToDevice).toHaveBeenCalledWith(
      "bearerToken",
      expect.objectContaining({
        id: "deviceId",
      }),
    );
    expect(assertChallengeConfirmationToDevice).toHaveBeenCalledWith(
      "challengeConfirmationToken",
      expect.objectContaining({
        id: "deviceId",
      }),
    );
    expect(ctx.repository.deviceRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "deviceId",
        recoveryKey: {
          signature: "generatedRecoveryKey",
          updated: expect.any(Date),
        },
      }),
    );
  });
});
