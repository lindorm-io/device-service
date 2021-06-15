import MockDate from "mockdate";
import { logger } from "../../test";
import { deviceUpdateName } from "./update-name";
import { assertBearerToDevice as _assertBearerToDevice } from "../../util";

MockDate.set("2021-01-01T08:00:00.000Z");

jest.mock("../../util", () => ({
  assertBearerToDevice: jest.fn(),
}));

const assertBearerToDevice = _assertBearerToDevice as unknown as jest.Mock;

describe("deviceUpdateName", () => {
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
        body: { name: "new-name" },
      },
      token: {
        bearerToken: "bearerToken",
      },
    };
  });

  test("should resolve and remove device", async () => {
    await expect(deviceUpdateName(ctx)).resolves.toStrictEqual({
      body: {},
      status: 202,
    });

    expect(assertBearerToDevice).toHaveBeenCalledWith(
      "bearerToken",
      expect.objectContaining({
        id: "deviceId",
      }),
    );
    expect(ctx.repository.deviceRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "deviceId",
        name: "new-name",
      }),
    );
  });
});
