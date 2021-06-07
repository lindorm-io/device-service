import MockDate from "mockdate";
import { Challenge, Device } from "../entity";
import { ChallengeHandler } from "./ChallengeHandler";
import { ChallengeScope, ChallengeStrategy } from "../enum";
import { CryptoKeyPair } from "@lindorm-io/crypto";
import {
  context,
  getTestCache,
  getTestChallenge,
  getTestDevice,
  getTestDeviceIssuer,
  getTestKeyPairRSA,
  inMemoryCache,
  logger,
} from "../test";
import { ClientError } from "@lindorm-io/errors";

jest.mock("jsonwebtoken", () => ({
  sign: (data: any) => data,
}));
jest.mock("uuid", () => ({
  v4: () => "bc54a8e9-3246-4cad-8244-0a1a42c914cd",
}));
jest.mock("@lindorm-io/core", () => ({
  ...(jest.requireActual("@lindorm-io/core") as any),
  getRandomValue: jest.fn(() => "ESJh38hYfJ7481UFTQgq63wxxiOub1Xt7YKGJIukrBlIA5RNR6rDriiQ977psN1u"),
}));

MockDate.set("2021-01-01T08:00:00.000Z");

describe("ChallengeHandler", () => {
  let ctx: any;
  let handler: ChallengeHandler;

  describe("assert", () => {
    let challenge: Challenge;
    let crypto: CryptoKeyPair;

    beforeEach(async () => {
      ctx = {
        ...context,
        cache: await getTestCache(),
        entity: {
          challenge: getTestChallenge({
            strategy: ChallengeStrategy.SECRET,
          }),
          device: await getTestDevice({
            pin: null,
            publicKey: getTestKeyPairRSA().publicKey,
            recoveryKey: null,
            secret: null,
          }),
        },
        logger,
      };
      challenge = await ctx.cache.challengeCache.create(ctx.entity.challenge);
      crypto = new CryptoKeyPair({
        algorithm: "RS512",
        passphrase: "",
        privateKey: getTestKeyPairRSA().privateKey as string,
        publicKey: getTestKeyPairRSA().publicKey,
      });
      handler = new ChallengeHandler(ctx);
    });

    test("should verify challenge", async () => {
      await expect(
        handler.assert(ChallengeStrategy.SECRET, crypto.sign(challenge.certificateChallenge)),
      ).resolves.toBeUndefined();
    });
  });

  describe("create", () => {
    beforeEach(async () => {
      ctx = {
        ...context,
        cache: await getTestCache(),
        entity: {
          device: new Device({
            id: "c12b0d8e-956e-4556-927c-c8588a71a4e1",
            accountId: "0e219ec4-66fd-4d96-a17f-bdbf89edea03",
            macAddress: "macAddress",
            name: "name",
            publicKey: "publicKey",
            uniqueId: "uniqueId",
          }),
        },
        logger,
      };
      handler = new ChallengeHandler(ctx);
    });

    test("should create a challenge", async () => {
      await expect(handler.create(ChallengeStrategy.IMPLICIT, ChallengeScope.SIGN_IN)).resolves.toMatchSnapshot();
      expect(inMemoryCache).toMatchSnapshot();
    });
  });

  describe("isNotExpired", () => {
    let challenge: Challenge;

    beforeEach(async () => {
      ctx = {
        ...context,
      };
      handler = new ChallengeHandler(ctx);
    });

    test("should succeed when date is before", () => {
      challenge = getTestChallenge({});
      expect(() => handler.isNotExpired(challenge)).not.toThrow();
    });

    test("should throw error when date is after", () => {
      challenge = getTestChallenge({
        expires: new Date("1999-01-01 01:00:00.000"),
      });
      expect(() => handler.isNotExpired(challenge)).toThrow(expect.any(ClientError));
    });
  });

  describe("getConfirmationToken", () => {
    beforeEach(async () => {
      ctx = {
        ...context,
        entity: {
          challenge: getTestChallenge({}),
          device: await getTestDevice({
            pin: null,
            recoveryKey: null,
            secret: null,
          }),
        },
        jwt: getTestDeviceIssuer(),
        metadata: { clientId: "clientId" },
      };
      handler = new ChallengeHandler(ctx);
    });

    test("should return a challenge confirmation token", () => {
      expect(handler.getConfirmationToken()).toMatchSnapshot();
    });
  });
});
