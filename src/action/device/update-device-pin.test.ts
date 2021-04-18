import MockDate from "mockdate";
import { Device } from "../../entity";
import { getTestRepository, inMemoryStore, logger, resetStore } from "../../test";
import { updateDevicePIN } from "./update-device-pin";
import { baseHash } from "@lindorm-io/core";

MockDate.set("2020-01-01 08:00:00.000");

describe("updateDevicePIN", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      handler: {
        authTokenHandler: {
          assertAccountPermission: () => {},
          assertScope: () => {},
        },
        deviceHandler: {
          encryptDevicePIN: (input: string) => baseHash(input),
        },
      },
      logger,
      repository: await getTestRepository(),
      token: {
        challengeConfirmation: {
          deviceId: "d7230fc6-322f-44d9-9ef6-b2abba9ad6a4",
        },
      },
    };

    await ctx.repository.deviceRepository.create(
      new Device({
        id: "d7230fc6-322f-44d9-9ef6-b2abba9ad6a4",
        accountId: "eaf6491b-d3c5-4122-b246-5a28cbe2ff3c",
        publicKey: "publicKey",
        pin: { signature: baseHash("999999"), updated: new Date() },
      }),
    );
  });

  afterEach(resetStore);

  test("should update device pin", async () => {
    await expect(
      updateDevicePIN(ctx)({
        pin: "123456",
      }),
    ).resolves.toBe(undefined);

    expect(inMemoryStore).toMatchSnapshot();
  });
});
