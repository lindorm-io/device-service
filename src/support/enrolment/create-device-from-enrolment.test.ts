import MockDate from "mockdate";
import { Enrolment } from "../../entity";
import { createDeviceFromEnrolment } from "./create-device-from-enrolment";
import { baseHash } from "@lindorm-io/core";
import { getTestEnrolment, getTestRepository, inMemoryStore } from "../../test";

MockDate.set("2020-01-01 08:00:00.000");

jest.mock("uuid", () => ({
  v4: () => "bc54a8e9-3246-4cad-8244-0a1a42c914cd",
}));
jest.mock("../device", () => ({
  encryptDevicePIN: jest.fn((input) => baseHash(input)),
  encryptDeviceSecret: jest.fn((input) => baseHash(input)),
}));

describe("createDeviceFromEnrolment", () => {
  let ctx: any;
  let enrolment: Enrolment;

  beforeEach(async () => {
    ctx = { repository: await getTestRepository() };
    enrolment = getTestEnrolment({});
  });

  test("should verify enrolment", async () => {
    await expect(
      createDeviceFromEnrolment(ctx)({
        enrolment,
        pin: "123456",
        secret: "6db92fbb-5384-4994-8316-66795d52a078",
      }),
    ).resolves.toMatchSnapshot();

    expect(inMemoryStore).toMatchSnapshot();
  });
});
