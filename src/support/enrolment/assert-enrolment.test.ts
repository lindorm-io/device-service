import MockDate from "mockdate";
import { getTestCache, getTestEnrolment, getTestKeyPairRSA, inMemoryCache } from "../../test";
import { assertEnrolment } from "./assert-enrolment";
import { Enrolment } from "../../entity";
import { KeyPairHandler } from "@lindorm-io/key-pair";

MockDate.set("2020-01-01 08:00:00.000");

describe("assertEnrolment", () => {
  let ctx: any;
  let enrolment: Enrolment;
  let handler: KeyPairHandler;

  beforeEach(async () => {
    ctx = { cache: await getTestCache() };
    enrolment = await ctx.cache.enrolment.create(
      getTestEnrolment({
        publicKey: getTestKeyPairRSA().publicKey,
      }),
    );
    handler = new KeyPairHandler({
      algorithm: "RS512",
      passphrase: "",
      privateKey: getTestKeyPairRSA().privateKey,
      publicKey: getTestKeyPairRSA().publicKey,
    });
  });

  test("should verify enrolment", async () => {
    await expect(
      assertEnrolment(ctx)({
        certificateVerifier: handler.sign(enrolment.certificateChallenge),
        enrolmentId: enrolment.id,
      }),
    ).resolves.toMatchSnapshot();

    expect(inMemoryCache).toMatchSnapshot();
  });
});
