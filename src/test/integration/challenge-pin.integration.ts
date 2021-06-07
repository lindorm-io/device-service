import MockDate from "mockdate";
import request from "supertest";
import { Device } from "../../entity";
import { baseHash } from "@lindorm-io/core";
import { koa } from "../../server/koa";
import {
  TEST_DEVICE_REPOSITORY,
  TEST_CRYPTO_KEY_PAIR,
  getTestDevice,
  resetStore,
  setupIntegration,
  resetCache,
} from "../grey-box";
import { ChallengeScope, ChallengeStrategy } from "../../enum";

MockDate.set("2021-01-01T08:00:00.000Z");

const basicAuth = baseHash("secret:secret");

describe("/device", () => {
  let device: Device;

  beforeAll(async () => {
    await setupIntegration();
    koa.load();
  });

  beforeEach(async () => {
    device = await TEST_DEVICE_REPOSITORY.create(await getTestDevice({}));
  });

  afterEach(() => {
    resetCache();
    resetStore();
  });

  test("POST /challenge - should successfully verify device challenge", async () => {
    const initialiseResponse = await request(koa.callback())
      .post("/challenge/initialise")
      .set("Authorization", `Basic ${basicAuth}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Device-ID", device.id)
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        account_id: device.accountId,
        device_id: device.id,
        scope: ChallengeScope.SIGN_IN,
        strategy: ChallengeStrategy.PIN,
      })
      .expect(201);

    expect(initialiseResponse.body).toStrictEqual({
      certificate_challenge: expect.any(String),
      challenge_id: expect.any(String),
      expires: expect.any(String),
    });

    const {
      body: { certificate_challenge: certificateChallenge, challenge_id: challengeId },
    } = initialiseResponse;

    const certificateVerifier = TEST_CRYPTO_KEY_PAIR.sign(certificateChallenge);

    const verifyResponse = await request(koa.callback())
      .post("/challenge/verify")
      .set("Authorization", `Basic ${basicAuth}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Device-ID", device.id)
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        account_id: device.accountId,
        device_id: device.id,

        certificate_verifier: certificateVerifier,
        challenge_id: challengeId,
        pin: "123456",
        strategy: ChallengeStrategy.PIN,
      })
      .expect(200);

    expect(verifyResponse.body).toStrictEqual({
      challenge_confirmation: {
        expires: 1609488600,
        expires_in: 600,
        id: expect.any(String),
        token: expect.any(String),
      },
    });
  });
});
