import MockDate from "mockdate";
import { Device } from "../../entity";
import { getTestRepository, inMemoryStore, logger, resetStore } from "../../test";
import { updateDeviceName } from "./update-device-name";

MockDate.set("2020-01-01 08:00:00.000");

describe("updateDeviceName", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      handler: {
        authTokenHandler: {
          assertAccountPermission: () => {},
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

  test("should update device name", async () => {
    await expect(
      updateDeviceName(ctx)({
        deviceId: "d7230fc6-322f-44d9-9ef6-b2abba9ad6a4",
        name: "name",
      }),
    ).resolves.toBe(undefined);

    expect(inMemoryStore).toMatchSnapshot();
  });
});
