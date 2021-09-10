import MockDate from "mockdate";
import request from "supertest";
import { EntityNotFoundError } from "@lindorm-io/entity";
import { koa } from "../../server/koa";
import { randomUUID } from "crypto";
import {
  getTestAccessToken,
  getTestChallengeConfirmationToken,
  getTestDevice,
  setupIntegration,
  TEST_DEVICE_REPOSITORY,
} from "../../test";
import { getRandomNumber, getRandomValue } from "@lindorm-io/core";

MockDate.set("2021-01-01T08:00:00.000Z");

describe("/protected/devices", () => {
  beforeAll(setupIntegration);

  test("GET /", async () => {
    await TEST_DEVICE_REPOSITORY.create(
      await getTestDevice({
        id: "8d154126-a800-42e1-98b0-f253070df4f2",
      }),
    );
    await TEST_DEVICE_REPOSITORY.create(
      await getTestDevice({
        id: "ca49192c-64f6-4a65-834d-72d3225b9989",
        macAddress: "E1:9A:09:75:46:93",
        name: "My Xperia 7",
        os: "Android OS 7",
        platform: "Android",
      }),
    );

    const accessToken = getTestAccessToken();

    const response = await request(koa.callback())
      .get("/protected/devices")
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toStrictEqual({
      devices: [
        {
          id: "8d154126-a800-42e1-98b0-f253070df4f2",
          name: "Test Person's iPhone",
          platform: "iPhone",
        },
        {
          id: "ca49192c-64f6-4a65-834d-72d3225b9989",
          name: "My Xperia 7",
          platform: "Android",
        },
      ],
    });
  });

  test("DELETE /:id", async () => {
    const device = await TEST_DEVICE_REPOSITORY.create(
      await getTestDevice({
        id: randomUUID(),
      }),
    );

    const accessToken = getTestAccessToken();

    await request(koa.callback())
      .delete(`/protected/devices/${device.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    await expect(TEST_DEVICE_REPOSITORY.find({ id: device.id })).rejects.toThrow(
      EntityNotFoundError,
    );
  });

  test("GET /:id", async () => {
    const device = await TEST_DEVICE_REPOSITORY.create(
      await getTestDevice({
        id: randomUUID(),
      }),
    );

    const accessToken = getTestAccessToken();

    const response = await request(koa.callback())
      .get(`/protected/devices/${device.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body).toStrictEqual({
      id: device.id,
      identity_id: "b799b044-16db-495a-b7e1-2cf3175d4b54",
      installation_id: "12be09f5-fcd4-438f-9b5d-dc1fb11e5e75",
      mac_address: "0B:ED:A0:D5:5A:2D",
      name: "Test Person's iPhone",
      os: "iPhone OS 13_5_1",
      platform: "iPhone",
      unique_id: "27a10522a6994bbca0e1fc666804b350",
    });
  });

  test("PUT /:id/biometry", async () => {
    const device = await TEST_DEVICE_REPOSITORY.create(
      await getTestDevice({
        id: randomUUID(),
      }),
    );

    const accessToken = getTestAccessToken();
    const challengeConfirmationToken = getTestChallengeConfirmationToken({
      claims: {
        deviceId: device.id,
      },
      sessionId: randomUUID(),
    });

    await request(koa.callback())
      .put(`/protected/devices/${device.id}/biometry`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        challengeConfirmationToken,
        biometry: getRandomValue(128),
      })
      .expect(200);

    const result = await TEST_DEVICE_REPOSITORY.find({ id: device.id });

    expect(result.biometry).not.toBe(device.biometry);
  });

  test("PUT /:id/pincode", async () => {
    const device = await TEST_DEVICE_REPOSITORY.create(
      await getTestDevice({
        id: randomUUID(),
      }),
    );

    const accessToken = getTestAccessToken();
    const challengeConfirmationToken = getTestChallengeConfirmationToken({
      claims: {
        deviceId: device.id,
      },
      sessionId: randomUUID(),
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
});
