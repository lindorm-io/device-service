import MockDate from "mockdate";
import { EnrolmentHandler } from "./EnrolmentHandler";
import { Device, Enrolment } from "../entity";
import { KeyPairHandler } from "@lindorm-io/key-pair";
import { baseHash } from "@lindorm-io/core";
import {
  context,
  getTestCache,
  getTestDevice,
  getTestEnrolment,
  getTestKeyPairRSA,
  getTestRepository,
  inMemoryCache,
  inMemoryStore,
  resetStore,
} from "../test";

jest.mock("uuid", () => ({
  v4: () => "bc54a8e9-3246-4cad-8244-0a1a42c914cd",
}));
jest.mock("@lindorm-io/core", () => ({
  ...jest.requireActual("@lindorm-io/core"),
  getRandomValue: jest.fn(() => "ESJh38hYfJ7481UFTQgq63wxxiOub1Xt7YKGJIukrBlIA5RNR6rDriiQ977psN1u"),
}));

MockDate.set("2020-01-01 08:00:00.000");

describe("EnrolmentHandler", () => {
  let ctx: any;
  let handler: EnrolmentHandler;

  describe("assert", () => {
    let enrolment: Enrolment;
    let keyPair: KeyPairHandler;

    beforeEach(async () => {
      ctx = {
        ...context,
        cache: await getTestCache(),
      };
      enrolment = await ctx.cache.enrolmentCache.create(
        getTestEnrolment({
          publicKey: getTestKeyPairRSA().publicKey,
        }),
      );
      keyPair = new KeyPairHandler({
        algorithm: "RS512",
        passphrase: "",
        privateKey: getTestKeyPairRSA().privateKey,
        publicKey: getTestKeyPairRSA().publicKey,
      });
      handler = new EnrolmentHandler(ctx);
    });

    test("should verify enrolment", async () => {
      await expect(
        handler.assert(enrolment.id, keyPair.sign(enrolment.certificateChallenge)),
      ).resolves.toMatchSnapshot();

      expect(inMemoryCache).toMatchSnapshot();
    });
  });

  describe("createDevice", () => {
    let enrolment: Enrolment;

    beforeEach(async () => {
      ctx = {
        handler: {
          deviceHandler: {
            encryptPin: (input: string) => baseHash(input),
            encryptRecoveryKey: (input: string) => baseHash(input),
            encryptSecret: (input: string) => baseHash(input),
          },
        },
        repository: await getTestRepository(),
      };
      enrolment = getTestEnrolment({});
      handler = new EnrolmentHandler(ctx);
    });

    test("should verify enrolment", async () => {
      await expect(
        handler.createDevice({
          enrolment,
          pin: "123456",
          recoveryKey: "ABCD-123456-ABCD-123456-ABCD",
          secret: "6db92fbb-5384-4994-8316-66795d52a078",
        }),
      ).resolves.toMatchSnapshot();

      expect(inMemoryStore).toMatchSnapshot();
    });
  });

  describe("create", () => {
    beforeEach(async () => {
      ctx = { cache: await getTestCache() };
      handler = new EnrolmentHandler(ctx);
    });

    test("should create an enrolment", async () => {
      await expect(
        handler.create({
          accountId: "543afa16-ba6f-4f40-8882-30b4450cd59b",
          macAddress: "00:00:0A:BB:28:FC",
          name: "My iPhone 11 Pro",
          publicKey: "publicKey",
          uniqueId: "472704d28e5c4187b841",
        }),
      ).resolves.toMatchSnapshot();

      expect(inMemoryCache).toMatchSnapshot();
    });
  });

  describe("removeDevice", () => {
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
      handler = new EnrolmentHandler(ctx);
    });

    afterEach(resetStore);

    test("should remove existing device", async () => {
      await ctx.repository.deviceRepository.create(device);

      await expect(handler.removeDevice(enrolment)).resolves.toBe(undefined);

      expect(inMemoryStore).toMatchSnapshot();
    });

    test("should not try to remove device that does not exist", async () => {
      await expect(handler.removeDevice(enrolment)).resolves.toBe(undefined);

      expect(inMemoryStore).toMatchSnapshot();
    });

    test("should not try to remove device when input is incorrect", async () => {
      enrolment = getTestEnrolment({
        accountId: "943ac663-f5b8-4eff-839a-0c7d4bba522b",
      });
      await ctx.repository.deviceRepository.create(device);

      await expect(handler.removeDevice(enrolment)).resolves.toBe(undefined);

      expect(inMemoryStore).toMatchSnapshot();
    });
  });
});
