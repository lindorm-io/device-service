import MockDate from "mockdate";
import { verifyEnrolment } from "./verify";
import { getTestCache, getTestEnrolment, logger } from "../../test";
import { Device, Enrolment } from "../../entity";

MockDate.set("2020-01-01 08:00:00.000");

describe("verifyEnrolment", () => {
  let ctx: any;
  let enrolment: Enrolment;

  beforeEach(async () => {
    ctx = {
      cache: await getTestCache(),
      handler: {
        enrolmentHandler: {
          assert: () => getTestEnrolment({}),
          createDevice: () =>
            new Device({
              id: "d256c6ec-b7b5-4cbf-8673-da2b21f5c703",
              accountId: "accountId",
              publicKey: "publicKey",
            }),
          removeDevice: () => {},
        },
        deviceHandler: {
          generateRecoveryKey: () => "recoveryKey",
        },
      },
      logger,
    };
    enrolment = await ctx.cache.enrolmentCache.create(getTestEnrolment({}));
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
