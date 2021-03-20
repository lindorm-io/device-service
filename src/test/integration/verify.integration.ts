import MockDate from "mockdate";
import request from "supertest";
import { Audience } from "../../enum";
import { Device } from "../../entity";
import { Permission, Scope } from "@lindorm-io/jwt";
import {
  TEST_ACCOUNT_ID,
  TEST_DEVICE_REPOSITORY,
  TEST_ISSUER,
  TEST_KEY_PAIR_HANDLER,
  getGreyBoxDevice,
  setupIntegration,
} from "../grey-box";
import { getRandomValue } from "@lindorm-io/core";
import { koa } from "../../server/koa";

MockDate.set("2020-01-01 08:00:00.000");

describe("/device", () => {
  let accessToken: string;
  let device: Device;
  let challenge: string;
  let verifier: string;

  beforeAll(async () => {
    await setupIntegration();
    koa.load();

    ({ token: accessToken } = TEST_ISSUER.sign({
      audience: Audience.ACCESS,
      expiry: "2 minutes",
      permission: Permission.USER,
      scope: [Scope.DEFAULT, Scope.EDIT].join(" "),
      subject: TEST_ACCOUNT_ID,
    }));
  });

  beforeEach(async () => {
    device = await getGreyBoxDevice();
    await TEST_DEVICE_REPOSITORY.create(device);

    challenge = getRandomValue(32);
    verifier = TEST_KEY_PAIR_HANDLER.sign(challenge);
  });

  test("POST /verify/challenge - should successfully verify device challenge", async () => {
    await request(koa.callback())
      .post("/verify/challenge")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        device_id: device.id,
        challenge,
        verifier,
      })
      .expect(204);
  });

  test("POST /verify/challenge - should throw error", async () => {
    await request(koa.callback())
      .post("/verify/challenge")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        device_id: device.id,
        challenge,
        verifier: TEST_KEY_PAIR_HANDLER.sign("wrong_challenge"),
      })
      .expect(403);
  });

  test("POST /verify/pin - should successfully verify device pin", async () => {
    await request(koa.callback())
      .post("/verify/pin")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        device_id: device.id,
        challenge,
        verifier,
        pin: "123456",
      })
      .expect(204);
  });

  test("POST /verify/pin - should throw error", async () => {
    await request(koa.callback())
      .post("/verify/pin")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        device_id: device.id,
        challenge,
        verifier,
        pin: "111111",
      })
      .expect(409);
  });

  test("POST /verify/secret - should successfully verify device secret", async () => {
    await request(koa.callback())
      .post("/verify/secret")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        device_id: device.id,
        challenge,
        verifier,
        secret: "test_device_secret",
      })
      .expect(204);
  });

  test("POST /verify/secret - should throw error", async () => {
    await request(koa.callback())
      .post("/verify/secret")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        device_id: device.id,
        challenge,
        verifier,
        secret: "wrong_secret",
      })
      .expect(409);
  });
});
