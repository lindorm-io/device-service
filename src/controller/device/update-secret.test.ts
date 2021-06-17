import MockDate from "mockdate";
import { logger } from "../../test";
import { deviceUpdateSecret } from "./update-secret";
import {
  assertBearerToDevice as _assertBearerToDevice,
  assertChallengeConfirmationToDevice as _assertChallengeConfirmationToDevice,
} from "../../util";

MockDate.set("2021-01-01T08:00:00.000Z");

jest.mock("../../crypto", () => ({
  cryptoLayered: {
    encrypt: (arg: any) => `${arg}-signature`,
  },
}));
jest.mock("../../util", () => ({
  assertBearerToDevice: jest.fn(),
  assertChallengeConfirmationToDevice: jest.fn(),
}));

const assertBearerToDevice = _assertBearerToDevice as unknown as jest.Mock;
const assertChallengeConfirmationToDevice = _assertChallengeConfirmationToDevice as unknown as jest.Mock;

describe("deviceUpdateSecret", () => {
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
      request: {
        body: { secret: "new-secret" },
      },
      token: {
        bearerToken: "bearerToken",
        challengeConfirmationToken: "challengeConfirmationToken",
      },
    };
  });

  test("should resolve and remove device", async () => {
    await expect(deviceUpdateSecret(ctx)).resolves.toStrictEqual({
      body: {},
      status: 202,
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
        secret: "new-secret-signature",
      }),
    );
  });
});
