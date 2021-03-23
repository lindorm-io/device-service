import MockDate from "mockdate";
import request from "supertest";
import { Device } from "../../entity";
import { baseHash, getRandomValue } from "@lindorm-io/core";
import { koa } from "../../server/koa";
import {
  TEST_DEVICE_REPOSITORY,
  TEST_KEY_PAIR_HANDLER,
  getTestDevice,
  setupIntegration,
  resetStore,
} from "../grey-box";

MockDate.set("2020-01-01 08:00:00.000");

const basicAuth = baseHash("secret:secret");

describe("/device", () => {
  let device: Device;
  let challenge: string;
  let verifier: string;

  beforeAll(async () => {
    await setupIntegration();
    koa.load();
  });

  beforeEach(async () => {
    device = await TEST_DEVICE_REPOSITORY.create(await getTestDevice());
    challenge = getRandomValue(32);
    verifier = TEST_KEY_PAIR_HANDLER.sign(challenge);
  });

  afterEach(resetStore);

  test("POST /headless/verify-challenge - should successfully verify device challenge", async () => {
    await request(koa.callback())
      .post("/headless/verify-challenge")
      .set("Authorization", `Basic ${basicAuth}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        account_id: device.accountId,
        device_challenge: challenge,
        device_id: device.id,
        device_verifier: verifier,
      })
      .expect(204);
  });

  test("POST /headless/verify-challenge - should throw error", async () => {
    await request(koa.callback())
      .post("/headless/verify-challenge")
      .set("Authorization", `Basic ${basicAuth}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        account_id: device.accountId,
        device_challenge: challenge,
        device_id: device.id,
        device_verifier: TEST_KEY_PAIR_HANDLER.sign("wrong_challenge"),
      })
      .expect(403);
  });

  test("POST /headless/verify-pin - should successfully verify device pin", async () => {
    await request(koa.callback())
      .post("/headless/verify-pin")
      .set("Authorization", `Basic ${basicAuth}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        account_id: device.accountId,
        device_challenge: challenge,
        device_id: device.id,
        device_verifier: verifier,
        pin: "123456",
      })
      .expect(204);
  });

  test("POST /headless/verify-pin - should throw error", async () => {
    await request(koa.callback())
      .post("/headless/verify-pin")
      .set("Authorization", `Basic ${basicAuth}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        account_id: device.accountId,
        device_challenge: challenge,
        device_id: device.id,
        device_verifier: verifier,
        pin: "111111",
      })
      .expect(409);
  });

  test("POST /headless/verify-secret - should successfully verify device secret", async () => {
    await request(koa.callback())
      .post("/headless/verify-secret")
      .set("Authorization", `Basic ${basicAuth}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        account_id: device.accountId,
        device_challenge: challenge,
        device_id: device.id,
        device_verifier: verifier,
        secret: "test_device_secret",
      })
      .expect(204);
  });

  test("POST /headless/verify-secret - should throw error", async () => {
    await request(koa.callback())
      .post("/headless/verify-secret")
      .set("Authorization", `Basic ${basicAuth}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        account_id: device.accountId,
        device_challenge: challenge,
        device_id: device.id,
        device_verifier: verifier,
        secret: "wrong_secret",
      })
      .expect(409);
  });
});
