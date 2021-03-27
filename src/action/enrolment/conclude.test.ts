import MockDate from "mockdate";
import { concludeEnrolment } from "./conclude";
import { getTestCache, getTestDevice, getTestEnrolment, logger } from "../../test";
import { Enrolment } from "../../entity";

jest.mock("../../support", () => ({
  assertEnrolment: jest.fn(() => () => getTestEnrolment({})),
  createDeviceFromEnrolment: jest.fn(() => () =>
    getTestDevice({
      pin: null,
      secret: null,
    }),
  ),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("initialiseEnrolment", () => {
  let ctx: any;
  let enrolment: Enrolment;

  beforeEach(async () => {
    ctx = {
      cache: await getTestCache(),
      logger,
    };
    enrolment = await ctx.cache.enrolment.create(getTestEnrolment({}));
  });

  test("should initialise device challenge", async () => {
    await expect(
      concludeEnrolment(ctx)({
        certificateVerifier: "verifier",
        enrolmentId: enrolment.id,
        pin: "123456",
        secret: "secret",
      }),
    ).resolves.toMatchSnapshot();
  });
});
