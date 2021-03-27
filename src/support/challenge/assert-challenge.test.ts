import MockDate from "mockdate";
import { Challenge } from "../../entity";
import { ChallengeStrategy } from "../../enum";
import { KeyPairHandler } from "@lindorm-io/key-pair";
import { assertChallenge } from "./assert-challenge";
import { getTestCache, getTestChallenge, getTestDevice, getTestKeyPairRSA } from "../../test";

MockDate.set("2020-01-01 08:00:00.000");

describe("verifyWithSecret", () => {
  let ctx: any;
  let challenge: Challenge;
  let handler: KeyPairHandler;

  beforeEach(async () => {
    const keyPair = getTestKeyPairRSA();
    ctx = {
      cache: await getTestCache(),
      device: await getTestDevice({
        pin: null,
        secret: null,
        publicKey: keyPair.publicKey,
      }),
    };
    challenge = await ctx.cache.challenge.create(
      getTestChallenge({
        strategy: ChallengeStrategy.SECRET,
      }),
    );
    handler = new KeyPairHandler({
      algorithm: "RS512",
      passphrase: "",
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey,
    });
  });

  test("should verify challenge", async () => {
    await expect(
      assertChallenge(ctx)({
        certificateVerifier: handler.sign(challenge.certificateChallenge),
        challengeId: challenge.id,
        strategy: ChallengeStrategy.SECRET,
      }),
    ).resolves.toBe(undefined);
  });
});
