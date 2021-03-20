import MockDate from "mockdate";
import { Device } from "../../entity";
import { getDevices } from "./get-devices";
import { getGreyBoxRepository, resetStore } from "../../test";
import { winston } from "../../logger";

jest.mock("../../support", () => ({
  assertAccountPermission: jest.fn(() => () => {}),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("removeDevice", () => {
  let ctx: any;

  beforeEach(async () => {
    ctx = {
      logger: winston,
      repository: await getGreyBoxRepository(),
    };

    await ctx.repository.device.create(
      new Device({
        id: "d7230fc6-322f-44d9-9ef6-b2abba9ad6a4",
        macAddress: "macAddress-1",
        name: "device-1",
        accountId: "eaf6491b-d3c5-4122-b246-5a28cbe2ff3c",
        publicKey: "publicKey",
        uniqueId: "uniqueId-1",
      }),
    );
    await ctx.repository.device.create(
      new Device({
        id: "b49724b8-94e7-4d84-aa10-682e18333098",
        macAddress: "macAddress-2",
        name: "device-2",
        accountId: "eaf6491b-d3c5-4122-b246-5a28cbe2ff3c",
        publicKey: "publicKey",
        uniqueId: "uniqueId-2",
      }),
    );
  });

  afterEach(resetStore);

  test("should get a list of devices", async () => {
    await expect(
      getDevices(ctx)({
        accountId: "eaf6491b-d3c5-4122-b246-5a28cbe2ff3c",
      }),
    ).resolves.toMatchSnapshot();
  });
});
