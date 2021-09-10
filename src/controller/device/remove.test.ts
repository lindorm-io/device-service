import MockDate from "mockdate";
import { deviceRemoveController } from "./remove";
import { getTestDevice } from "../../test";

MockDate.set("2021-01-01T08:00:00.000Z");

describe("deviceRemoveController", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      entity: {
        device: await getTestDevice(),
      },
      repository: {
        deviceRepository: {
          remove: jest.fn(),
        },
      },
    };
  });

  test("should resolve and remove device", async () => {
    await expect(deviceRemoveController(ctx)).resolves.toStrictEqual({
      data: {},
    });

    expect(ctx.repository.deviceRepository.remove).toHaveBeenCalled();
  });
});
