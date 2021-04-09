import MockDate from "mockdate";
import { Device, Enrolment } from "../../entity";
import { getTestDevice, getTestEnrolment, getTestRepository, inMemoryStore, resetStore } from "../../test";
import { removeEnrolledDevice } from "./remove-enrolled-device";

MockDate.set("2020-01-01 08:00:00.000");

jest.mock("uuid", () => ({
  v4: () => "bc54a8e9-3246-4cad-8244-0a1a42c914cd",
}));

describe("removeEnrolledDevice", () => {
  let ctx: any;
  let enrolment: Enrolment;
  let device: Device;

  beforeEach(async () => {
    ctx = { repository: await getTestRepository() };
    enrolment = getTestEnrolment({});
    device = await getTestDevice({
      pin: null,
      secret: null,
      recoveryKey: null,
    });
  });

  afterEach(resetStore);

  test("should remove existing device", async () => {
    await ctx.repository.device.create(device);

    await expect(removeEnrolledDevice(ctx)(enrolment)).resolves.toBe(undefined);

    expect(inMemoryStore).toMatchSnapshot();
  });

  test("should not try to remove device that does not exist", async () => {
    await expect(removeEnrolledDevice(ctx)(enrolment)).resolves.toBe(undefined);

    expect(inMemoryStore).toMatchSnapshot();
  });

  test("should not try to remove device when input is incorrect", async () => {
    enrolment = getTestEnrolment({
      accountId: "943ac663-f5b8-4eff-839a-0c7d4bba522b",
    });
    await ctx.repository.device.create(device);

    await expect(removeEnrolledDevice(ctx)(enrolment)).resolves.toBe(undefined);

    expect(inMemoryStore).toMatchSnapshot();
  });
});
