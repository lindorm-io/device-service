import MockDate from "mockdate";
import { Device } from "../../entity";
import { getTestRepository, inMemoryStore, logger, resetStore } from "../../test";
import { updateDeviceSecret } from "./update-device-secret";
import { baseHash } from "@lindorm-io/core";

MockDate.set("2020-01-01 08:00:00.000");

describe("updateDeviceSecret", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      handler: {
        authTokenHandler: {
          assertAccountPermission: () => {},
          assertScope: () => {},
        },
        deviceHandler: {
          encryptDeviceSecret: (input: string) => baseHash(input),
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
        pin: { signature: baseHash("123456"), updated: new Date() },
        secret: { signature: baseHash("old_secret"), updated: new Date() },
      }),
    );
  });

  afterEach(resetStore);

  test("should update device secret", async () => {
    await expect(
      updateDeviceSecret(ctx)({
        secret: "new_updated_secret",
      }),
    ).resolves.toBe(undefined);

    expect(inMemoryStore).toMatchSnapshot();
  });
});
