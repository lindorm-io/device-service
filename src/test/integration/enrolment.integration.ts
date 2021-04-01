import MockDate from "mockdate";
import request from "supertest";
import { Device } from "../../entity";
import { koa } from "../../server/koa";
import {
  TEST_DEVICE_REPOSITORY,
  TEST_KEY_PAIR_HANDLER,
  generateAccessToken,
  getTestKeyPairRSA,
  resetCache,
  resetStore,
  setupIntegration,
} from "../grey-box";

MockDate.set("2020-01-01 08:00:00.000");

describe("/enrolment", () => {
  let accessToken: string;

  beforeAll(async () => {
    await setupIntegration();
    koa.load();
  });

  beforeEach(async () => {
    accessToken = generateAccessToken({ deviceId: null });
  });

  afterEach(() => {
    resetCache();
    resetStore();
  });

  test("POST /enrolment - should successfully create a device", async () => {
    const initialiseResponse = await request(koa.callback())
      .post("/enrolment/initialise")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        mac_address: "00.00.0A.BB.28.FC",
        name: "My iPhone 12",
        public_key: getTestKeyPairRSA().publicKey,
        unique_id: "f4360613f0ec4805",
      })
      .expect(201);

    expect(initialiseResponse.body).toStrictEqual({
      certificate_challenge: expect.any(String),
      enrolment_id: expect.any(String),
      expires: expect.any(String),
    });

    const {
      body: { certificate_challenge: certificateChallenge, enrolment_id: enrolmentId },
    } = initialiseResponse;

    const certificateVerifier = TEST_KEY_PAIR_HANDLER.sign(certificateChallenge);

    const concludeResponse = await request(koa.callback())
      .post("/enrolment/verify")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        certificate_verifier: certificateVerifier,
        enrolment_id: enrolmentId,
        pin: "123456",
        secret: "6ef6c533bc0244688dd11c6dd1ab49e5",
      })
      .expect(201);

    const {
      body: { device_id: deviceId, recovery_keys: recoveryKeys },
    } = concludeResponse;

    await expect(TEST_DEVICE_REPOSITORY.find({ id: deviceId })).resolves.toStrictEqual(expect.any(Device));
    expect(recoveryKeys).toStrictEqual(expect.any(Array));
  });
});
