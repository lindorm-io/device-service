import MockDate from "mockdate";
import request from "supertest";
import { Device } from "../../entity";
import { koa } from "../../server/koa";
import {
  TEST_DEVICE_REPOSITORY,
  generateAccessToken,
  getTestDevice,
  resetStore,
  setupIntegration,
  generateChallengeConfirmationToken,
} from "../grey-box";

MockDate.set("2020-01-01 08:00:00.000");

describe("/device", () => {
  let accessToken: string;
  let challengeConfirmationToken: string;
  let device: Device;

  beforeAll(async () => {
    await setupIntegration();
    koa.load();
  });

  beforeEach(async () => {
    device = await TEST_DEVICE_REPOSITORY.create(
      await getTestDevice({
        id: null,
        pin: null,
        recoveryKey: null,
        secret: null,
      }),
    );
    accessToken = generateAccessToken({ deviceId: device.id });
    challengeConfirmationToken = generateChallengeConfirmationToken({ deviceId: device.id });
  });

  afterEach(resetStore);

  test("PATCH /device/change/pin", async () => {
    await request(koa.callback())
      .patch(`/device/change/pin`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Device-ID", device.id)
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        challenge_confirmation_token: challengeConfirmationToken,
        pin: "123456",
      })
      .expect(202);

    const result = await TEST_DEVICE_REPOSITORY.find({ id: device.id });
    expect(result.pin.signature).toStrictEqual(expect.any(String));
  });

  test("PATCH /device/change/recovery-key", async () => {
    const response = await request(koa.callback())
      .patch(`/device/change/recovery-key`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Device-ID", device.id)
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        challenge_confirmation_token: challengeConfirmationToken,
      })
      .expect(200);

    expect(response.body).toStrictEqual({
      recovery_key: expect.any(String),
    });

    const result = await TEST_DEVICE_REPOSITORY.find({ id: device.id });
    expect(result.recoveryKey.signature).toStrictEqual(expect.any(String));
  });

  test("PATCH /device/change/secret", async () => {
    await request(koa.callback())
      .patch(`/device/change/secret`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Device-ID", device.id)
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        challenge_confirmation_token: challengeConfirmationToken,
        secret: "new_test_device_secret",
      })
      .expect(202);

    const result = await TEST_DEVICE_REPOSITORY.find({ id: device.id });
    expect(result.secret.signature).toStrictEqual(expect.any(String));
  });
});
