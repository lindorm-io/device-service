import MockDate from "mockdate";
import { logger } from "../../test";
import { deviceUpdateBiometry } from "./update-biometry";
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

describe("deviceUpdateBiometry", () => {
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
        body: { biometry: "new-biometry" },
      },
      token: {
        bearerToken: "bearerToken",
        challengeConfirmationToken: "challengeConfirmationToken",
      },
    };
  });

  test("should resolve and remove device", async () => {
    await expect(deviceUpdateBiometry(ctx)).resolves.toStrictEqual({
      body: {},
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
        biometry: "new-biometry-signature",
      }),
    );
  });
});
