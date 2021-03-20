import MockDate from "mockdate";
import { baseHash } from "@lindorm-io/core";
import { createDevice } from "./create-device";
import { getGreyBoxRepository, inMemoryStore, resetStore } from "../../test";
import { winston } from "../../logger";

jest.mock("uuid", () => ({
  v4: jest.fn(() => "be3a62d1-24a0-401c-96dd-3aff95356811"),
}));
jest.mock("../../support", () => ({
  assertAccountPermission: jest.fn(() => () => {}),
  assertScope: jest.fn(() => () => {}),
  encryptDevicePIN: jest.fn((input) => baseHash(input)),
  encryptDeviceSecret: jest.fn((input) => baseHash(input)),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("createDevice", () => {
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
  });

  afterEach(resetStore);

  test("should create a device", async () => {
    await expect(
      createDevice(ctx)({
        macAddress: "macAddress",
        name: "name",
        pin: "123456",
        publicKey: "publicKey",
        secret: "secret",
        uniqueId: "uniqueId",
      }),
    ).resolves.toStrictEqual({
      deviceId: "be3a62d1-24a0-401c-96dd-3aff95356811",
    });
    expect(inMemoryStore).toMatchSnapshot();
  });
});
