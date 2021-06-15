import MockDate from "mockdate";
import { logger } from "../../test";
import { deviceRemove } from "./remove";
import { assertBearerToDevice as _assertBearerToDevice } from "../../util";

MockDate.set("2021-01-01T08:00:00.000Z");

jest.mock("../../util", () => ({
  assertBearerToDevice: jest.fn(),
}));

const assertBearerToDevice = _assertBearerToDevice as unknown as jest.Mock;

describe("deviceRemove", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      entity: {
        device: { id: "deviceId", accountId: "accountId" },
      },
      logger,
      repository: {
        deviceRepository: { remove: jest.fn() },
      },
      token: {
        bearerToken: "bearerToken",
      },
    };
  });

  test("should resolve and remove device", async () => {
    await expect(deviceRemove(ctx)).resolves.toStrictEqual({
      body: {},
      status: 202,
    });

    expect(assertBearerToDevice).toHaveBeenCalledWith(
      "bearerToken",
      expect.objectContaining({
        id: "deviceId",
      }),
    );
    expect(ctx.repository.deviceRepository.remove).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "deviceId",
      }),
    );
  });
});
