import MockDate from "mockdate";
import request from "supertest";
import { EntityNotFoundError } from "@lindorm-io/entity";
import { getRandomNumber, getRandomString } from "@lindorm-io/core";
import { koa } from "../../server/koa";
import { randomUUID } from "crypto";
import {
  getTestAccessToken,
  getTestChallengeConfirmationToken,
  getTestDevice,
  setupIntegration,
  TEST_DEVICE_REPOSITORY,
} from "../../test";

MockDate.set("2021-01-01T08:00:00.000Z");

describe("/protected/devices", () => {
  beforeAll(setupIntegration);

  test("GET /", async () => {
    const device = await TEST_DEVICE_REPOSITORY.create(await getTestDevice());
    const device2 = await TEST_DEVICE_REPOSITORY.create(
      await getTestDevice({
        identityId: device.identityId,
        macAddress: "E1:9A:09:75:46:93",
        name: "My Xperia 7",
        os: "Android OS 7",
        platform: "Android",
      }),
    );

    const accessToken = getTestAccessToken({
      subject: device.identityId,
    });

    const response = await request(koa.callback())
      .get("/protected/devices")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toStrictEqual({
      devices: expect.arrayContaining([
        expect.objectContaining({
          id: device.id,
        }),
        expect.objectContaining({
          id: device2.id,
        }),
      ]),
    });
  });

  test("DELETE /:id", async () => {
    const device = await TEST_DEVICE_REPOSITORY.create(
      await getTestDevice({
        id: randomUUID(),
      }),
    );

    const accessToken = getTestAccessToken({
      subject: device.identityId,
    });

    await request(koa.callback())
      .delete(`/protected/devices/${device.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    await expect(TEST_DEVICE_REPOSITORY.find({ id: device.id })).rejects.toThrow(
      EntityNotFoundError,
    );
  });

  test("GET /:id", async () => {
    const device = await TEST_DEVICE_REPOSITORY.create(await getTestDevice());

    const accessToken = getTestAccessToken({
      subject: device.identityId,
    });

    const response = await request(koa.callback())
      .get(`/protected/devices/${device.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toStrictEqual({
      id: device.id,
      active: true,
      identity_id: device.identityId,
      installation_id: device.installationId,
      mac_address: "0B:ED:A0:D5:5A:2D",
      name: "Test Person's iPhone",
      os: "iPhone OS 13_5_1",
      platform: "iPhone",
      trusted: true,
      unique_id: device.uniqueId,
    });
  });

  test("PUT /:id/biometry", async () => {
    const device = await TEST_DEVICE_REPOSITORY.create(await getTestDevice());

    const accessToken = getTestAccessToken({
      subject: device.identityId,
    });
    const challengeConfirmationToken = getTestChallengeConfirmationToken({
      claims: {
        deviceId: device.id,
      },
      sessionId: randomUUID(),
      subject: device.identityId,
    });

    await request(koa.callback())
      .put(`/protected/devices/${device.id}/biometry`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        challengeConfirmationToken,
        biometry: getRandomString(128),
      })
      .expect(200);

    const result = await TEST_DEVICE_REPOSITORY.find({ id: device.id });

    expect(result.biometry).not.toBe(device.biometry);
  });

  test("PUT /:id/pincode", async () => {
    const device = await TEST_DEVICE_REPOSITORY.create(await getTestDevice());

    const accessToken = getTestAccessToken({
      subject: device.identityId,
    });
    const challengeConfirmationToken = getTestChallengeConfirmationToken({
      claims: {
        deviceId: device.id,
      },
      sessionId: randomUUID(),
      subject: device.identityId,
    });

    await request(koa.callback())
      .put(`/protected/devices/${device.id}/pincode`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        challengeConfirmationToken,
        pincode: (await getRandomNumber(6)).toString(),
      })
      .expect(200);

    const result = await TEST_DEVICE_REPOSITORY.find({ id: device.id });

    expect(result.pincode).not.toBe(device.pincode);
  });

  test("PUT /:id/trusted", async () => {
    const device = await TEST_DEVICE_REPOSITORY.create(
      await getTestDevice({
        trusted: false,
      }),
    );

    const accessToken = getTestAccessToken({
      subject: device.identityId,
    });
    const challengeConfirmationToken = getTestChallengeConfirmationToken({
      claims: {
        deviceId: device.id,
      },
      sessionId: randomUUID(),
      subject: device.identityId,
    });

    await request(koa.callback())
      .put(`/protected/devices/${device.id}/trusted`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        challengeConfirmationToken,
      })
      .expect(200);

    const result = await TEST_DEVICE_REPOSITORY.find({ id: device.id });

    expect(result.trusted).toBe(true);
  });
});
