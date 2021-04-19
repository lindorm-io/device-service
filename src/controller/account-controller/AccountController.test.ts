import MockDate from "mockdate";
import { AccountController } from "./AccountController";
import { getTestContext, resetAll } from "../../test";
import { Device } from "../../entity";

MockDate.set("2020-01-01 08:00:00.000");

describe("AccountController", () => {
  let ctx: any;
  let controller: AccountController;

  beforeEach(async () => {
    ctx = {
      ...(await getTestContext()),
      token: {
        bearer: {
          subject: "subject",
        },
      },
    };

    await ctx.repository.deviceRepository.create(
      new Device({
        id: "d7230fc6-322f-44d9-9ef6-b2abba9ad6a4",
        macAddress: "macAddress-1",
        name: "device-1",
        accountId: "eaf6491b-d3c5-4122-b246-5a28cbe2ff3c",
        publicKey: "publicKey",
        uniqueId: "uniqueId-1",
      }),
    );
    await ctx.repository.deviceRepository.create(
      new Device({
        id: "b49724b8-94e7-4d84-aa10-682e18333098",
        macAddress: "macAddress-2",
        name: "device-2",
        accountId: "eaf6491b-d3c5-4122-b246-5a28cbe2ff3c",
        publicKey: "publicKey",
        uniqueId: "uniqueId-2",
      }),
    );
    await ctx.repository.deviceRepository.create(
      new Device({
        id: "2a00d50d-c21a-4d51-b222-0f48d91c5501",
        macAddress: "macAddress-3",
        name: "device-3",
        accountId: "f095a177-7a68-4ac8-9cc6-339d43c6f311",
        publicKey: "publicKey",
        uniqueId: "uniqueId-3",
      }),
    );

    controller = new AccountController(ctx);
  });

  afterEach(resetAll);

  describe("getDevices", () => {
    test("should initialise device enrolment", async () => {
      await expect(
        controller.getDevices({
          accountId: "eaf6491b-d3c5-4122-b246-5a28cbe2ff3c",
        }),
      ).resolves.toMatchSnapshot();
    });
  });
});
