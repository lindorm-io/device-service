import MockDate from "mockdate";
import request from "supertest";
import {
  TEST_DEVICE_REPOSITORY,
  generateAccessToken,
  getTestDevice,
  setupIntegration,
  resetAll,
  generateChallengeConfirmationToken,
} from "../test";
import { koa } from "../server/koa";
import { getRandomValue } from "@lindorm-io/core";

MockDate.set("2021-01-01T08:00:00.000Z");

describe("/device", () => {
  beforeAll(setupIntegration);
  afterAll(resetAll);

  test("DELETE /", async () => {
    const device = await TEST_DEVICE_REPOSITORY.create(await getTestDevice({}));
    const accessToken = generateAccessToken({
      deviceId: device.id,
    });

    const response = await request(koa.callback())
      .delete("/device")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Device-ID", device.id)
      .send({
        device_id: device.id,
      })
      .expect(202);

    expect(response.body).toStrictEqual({});
  });

  test("PATCH /name", async () => {
    const device = await TEST_DEVICE_REPOSITORY.create(await getTestDevice({}));
    const accessToken = generateAccessToken({
      deviceId: device.id,
    });

    const response = await request(koa.callback())
      .patch("/device/name")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Device-ID", device.id)
      .send({
        device_id: device.id,
        name: "new-name",
      })
      .expect(202);

    expect(response.body).toStrictEqual({});
  });

  test("PATCH /pincode", async () => {
    const device = await TEST_DEVICE_REPOSITORY.create(await getTestDevice({}));
    const accessToken = generateAccessToken({
      deviceId: device.id,
    });
    const challengeConfirmationToken = generateChallengeConfirmationToken({
      deviceId: device.id,
    });

    const response = await request(koa.callback())
      .patch("/device/pincode")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Device-ID", device.id)
      .send({
        challenge_confirmation_token: challengeConfirmationToken,
        pincode: "987654",
      })
      .expect(202);

    expect(response.body).toStrictEqual({});
  });

  test("PATCH /recovery-key", async () => {
    const device = await TEST_DEVICE_REPOSITORY.create(await getTestDevice({}));
    const accessToken = generateAccessToken({
      deviceId: device.id,
    });
    const challengeConfirmationToken = generateChallengeConfirmationToken({
      deviceId: device.id,
    });

    const response = await request(koa.callback())
      .patch("/device/recovery-key")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Device-ID", device.id)
      .send({
        challenge_confirmation_token: challengeConfirmationToken,
      })
      .expect(200);

    expect(response.body).toStrictEqual({
      recovery_key: expect.any(String),
    });
  });

  test("PATCH /secret", async () => {
    const device = await TEST_DEVICE_REPOSITORY.create(await getTestDevice({}));
    const accessToken = generateAccessToken({
      deviceId: device.id,
    });
    const challengeConfirmationToken = generateChallengeConfirmationToken({
      deviceId: device.id,
    });

    const response = await request(koa.callback())
      .patch("/device/secret")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Device-ID", device.id)
      .send({
        challenge_confirmation_token: challengeConfirmationToken,
        secret: getRandomValue(128),
      })
      .expect(202);

    expect(response.body).toStrictEqual({});
  });
});
