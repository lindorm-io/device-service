import MockDate from "mockdate";
import { Device } from "../../entity";
import { getTestRepository, inMemoryStore, resetStore } from "../../test";
import { updateDeviceSecret } from "./update-device-secret";
import { winston } from "../../logger";
import { baseHash } from "@lindorm-io/core";

jest.mock("../../support", () => ({
  assertAccountPermission: jest.fn(() => () => {}),
  assertDevicePIN: jest.fn(() => {}),
  assertScope: jest.fn(() => () => {}),
  encryptDeviceSecret: jest.fn((input) => baseHash(input)),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("updateDeviceSecret", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      logger: winston,
      repository: await getTestRepository(),
      token: {
        bearer: {
          subject: "e2829fb8-8fa5-4286-892f-228a9e9d2f5b",
        },
      },
    };

    await ctx.repository.device.create(
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
        deviceId: "d7230fc6-322f-44d9-9ef6-b2abba9ad6a4",
        pin: "123456",
        updatedSecret: "new_updated_secret",
      }),
    ).resolves.toBe(undefined);

    expect(inMemoryStore).toMatchSnapshot();
  });
});
