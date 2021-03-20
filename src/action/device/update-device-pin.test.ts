import MockDate from "mockdate";
import { Device } from "../../entity";
import { getGreyBoxRepository, inMemoryStore, resetStore } from "../../test";
import { updateDevicePIN } from "./update-device-pin";
import { winston } from "../../logger";
import { baseHash } from "@lindorm-io/core";

jest.mock("../../support", () => ({
  assertAccountPermission: jest.fn(() => () => {}),
  assertDevicePIN: jest.fn(() => {}),
  assertScope: jest.fn(() => () => {}),
  encryptDevicePIN: jest.fn((input) => baseHash(input)),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("updateDevicePIN", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      logger: winston,
      repository: await getGreyBoxRepository(),
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
        pin: { signature: baseHash("999999"), updated: new Date() },
      }),
    );
  });

  afterEach(resetStore);

  test("should update device pin", async () => {
    await expect(
      updateDevicePIN(ctx)({
        deviceId: "d7230fc6-322f-44d9-9ef6-b2abba9ad6a4",
        pin: "999999",
        updatedPin: "123456",
      }),
    ).resolves.toBe(undefined);

    expect(inMemoryStore).toMatchSnapshot();
  });
});
