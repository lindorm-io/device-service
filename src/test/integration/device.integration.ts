import MockDate from "mockdate";
import request from "supertest";
import { Device } from "../../entity";
import { RepositoryEntityNotFoundError } from "@lindorm-io/mongo";
import { koa } from "../../server/koa";
import {
  TEST_ACCOUNT_ID,
  TEST_DEVICE_REPOSITORY,
  generateAccessToken,
  getTestDevice,
  resetStore,
  setupIntegration,
} from "../grey-box";

MockDate.set("2020-01-01 08:00:00.000");

describe("/device", () => {
  let accessToken: string;
  let device: Device;

  beforeAll(async () => {
    await setupIntegration();
    koa.load();
  });

  beforeEach(async () => {
    device = await TEST_DEVICE_REPOSITORY.create(
      await getTestDevice({
        id: null,
      }),
    );
    accessToken = generateAccessToken();
  });

  afterEach(resetStore);

  test("GET /:id", async () => {
    const response = await request(koa.callback())
      .get(`/device/${TEST_ACCOUNT_ID}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .expect(200);

    expect(response.body).toStrictEqual({
      devices: [
        expect.objectContaining({
          deviceId: device.id,
        }),
      ],
    });
  });

  test("DELETE /:id", async () => {
    await request(koa.callback())
      .delete(`/device/${device.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .expect(202);

    await expect(TEST_DEVICE_REPOSITORY.find({ id: device.id })).rejects.toStrictEqual(
      expect.any(RepositoryEntityNotFoundError),
    );
  });

  test("PATCH /:id/name", async () => {
    await request(koa.callback())
      .patch(`/device/${device.id}/name`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        name: "new-name",
      })
      .expect(204);

    const result = await TEST_DEVICE_REPOSITORY.find({ id: device.id });
    expect(result.name).toBe("new-name");
  });

  test("PATCH /:id/pin", async () => {
    const oldSignature = device.pin.signature;

    await request(koa.callback())
      .patch(`/device/${device.id}/pin`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        pin: "123456",
        updatedPin: "987654",
      })
      .expect(204);

    const result = await TEST_DEVICE_REPOSITORY.find({ id: device.id });
    expect(result.pin.signature).not.toBe(oldSignature);
  });

  test("PATCH /:id/secret", async () => {
    const oldSignature = device.secret.signature;

    await request(koa.callback())
      .patch(`/device/${device.id}/secret`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        pin: "123456",
        updatedSecret: "new_test_device_secret",
      })
      .expect(204);

    const result = await TEST_DEVICE_REPOSITORY.find({ id: device.id });
    expect(result.secret.signature).not.toBe(oldSignature);
  });
});
