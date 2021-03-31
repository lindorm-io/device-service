import MockDate from "mockdate";
import { verifyEnrolment } from "./verify";
import { getTestCache, getTestEnrolment, logger } from "../../test";
import { Device, Enrolment } from "../../entity";
import { baseHash } from "@lindorm-io/core";

jest.mock("../../support", () => ({
  assertEnrolment: jest.fn(() => () => getTestEnrolment({})),
  createDeviceFromEnrolment: jest.fn(() => () =>
    new Device({
      id: "d256c6ec-b7b5-4cbf-8673-da2b21f5c703",
      accountId: "accountId",
      publicKey: "publicKey",
    }),
  ),
  createDeviceRecoveryKeys: jest.fn(() => ({
    recoveryKeys: ["key1"],
    signatures: [baseHash("key1")],
  })),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("verifyEnrolment", () => {
  let ctx: any;
  let enrolment: Enrolment;

  beforeEach(async () => {
    ctx = {
      cache: await getTestCache(),
      logger,
    };
    enrolment = await ctx.cache.enrolment.create(getTestEnrolment({}));
  });

  test("should verify device enrolment", async () => {
    await expect(
      verifyEnrolment(ctx)({
        certificateVerifier: "verifier",
        enrolmentId: enrolment.id,
        pin: "123456",
        secret: "secret",
      }),
    ).resolves.toMatchSnapshot();
  });
});
