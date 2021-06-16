import MockDate from "mockdate";
import request from "supertest";
import { Device } from "../entity";
import { koa } from "../server/koa";
import {
  TEST_DEVICE_REPOSITORY,
  TEST_CRYPTO_KEY_PAIR,
  getTestKeyPairRSA,
  setupIntegration,
  generateAccessToken,
} from "../test";
import { resetAll } from "../test";
import { getRandomNumber, getRandomValue } from "@lindorm-io/core";

MockDate.set("2021-01-01T08:00:00.000Z");

describe("/enrolment", () => {
  beforeAll(setupIntegration);
  afterAll(resetAll);

  test("POST /initialise & /verify", async () => {
    const accessToken = generateAccessToken({});

    const initialiseResponse = await request(koa.callback())
      .post("/enrolment/initialise")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        mac_address: "00.00.0A.BB.28.FC",
        name: "My iPhone 12",
        public_key: getTestKeyPairRSA().publicKey,
        unique_id: "f4360613f0ec4805",
      })
      .expect(200);

    expect(initialiseResponse.body).toStrictEqual({
      certificate_challenge: expect.any(String),
      enrolment_session_token: expect.any(String),
      expires: expect.any(Number),
      expires_in: expect.any(Number),
    });

    const {
      body: { certificate_challenge: certificateChallenge, enrolment_session_token: enrolmentSessionToken },
    } = initialiseResponse;

    const certificateVerifier = TEST_CRYPTO_KEY_PAIR.sign(certificateChallenge);

    const verifyResponse = await request(koa.callback())
      .post("/enrolment/verify")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        certificate_verifier: certificateVerifier,
        enrolment_session_token: enrolmentSessionToken,
        pincode: (await getRandomNumber(6)).toString(),
        secret: getRandomValue(128),
      })
      .expect(201);

    expect(verifyResponse.body).toStrictEqual({
      challenge_confirmation_token: expect.any(String),
      device_id: expect.any(String),
      expires: expect.any(Number),
      expires_in: expect.any(Number),
      recovery_key: expect.any(String),
    });

    const {
      body: { device_id: deviceId },
    } = verifyResponse;

    await expect(TEST_DEVICE_REPOSITORY.find({ id: deviceId })).resolves.toStrictEqual(expect.any(Device));
  });
});
