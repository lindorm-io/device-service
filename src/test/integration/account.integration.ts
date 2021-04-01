import MockDate from "mockdate";
import request from "supertest";
import { Device } from "../../entity";
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

describe("/account", () => {
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

  test("GET /:id", async () => {
    const response = await request(koa.callback())
      .get(`/account/${TEST_ACCOUNT_ID}`)
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
});
