import MockDate from "mockdate";
import request from "supertest";
import { Device } from "../../entity";
import { EntityNotFoundError } from "@lindorm-io/mongo";
import { koa } from "../../server/koa";
import { TEST_DEVICE_REPOSITORY, generateAccessToken, getTestDevice, resetStore, setupIntegration } from "../grey-box";

MockDate.set("2021-01-01T08:00:00.000Z");

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
    accessToken = generateAccessToken({ deviceId: device.id });
  });

  afterEach(resetStore);

  test("PATCH /:id", async () => {
    await request(koa.callback())
      .patch(`/device/${device.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        name: "new-name",
      })
      .expect(202);

    const result = await TEST_DEVICE_REPOSITORY.find({ id: device.id });
    expect(result.name).toBe("new-name");
  });

  test("DELETE /:id", async () => {
    await request(koa.callback())
      .delete(`/device/${device.id}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .expect(202);

    await expect(TEST_DEVICE_REPOSITORY.find({ id: device.id })).rejects.toStrictEqual(expect.any(EntityNotFoundError));
  });
});
