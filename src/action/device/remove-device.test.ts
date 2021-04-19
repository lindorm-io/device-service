import MockDate from "mockdate";
import { Device } from "../../entity";
import { getTestRepository, inMemoryStore, logger, resetStore } from "../../test";
import { removeDevice } from "./remove-device";

MockDate.set("2020-01-01 08:00:00.000");

describe("removeDevice", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      handler: {
        authTokenHandler: {
          assertPermission: () => {},
          assertScope: () => {},
        },
      },
      logger,
      repository: await getTestRepository(),
    };

    await ctx.repository.deviceRepository.create(
      new Device({
        id: "d7230fc6-322f-44d9-9ef6-b2abba9ad6a4",
        accountId: "eaf6491b-d3c5-4122-b246-5a28cbe2ff3c",
        publicKey: "publicKey",
      }),
    );
  });

  afterEach(resetStore);

  test("should remove a device", async () => {
    await expect(
      removeDevice(ctx)({
        deviceId: "d7230fc6-322f-44d9-9ef6-b2abba9ad6a4",
      }),
    ).resolves.toBe(undefined);

    expect(inMemoryStore).toMatchSnapshot();
  });
});
