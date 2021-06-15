import MockDate from "mockdate";
import request from "supertest";
import { TEST_DEVICE_REPOSITORY, generateAccessToken, getTestDevice, setupIntegration, resetAll } from "../test";
import { koa } from "../server/koa";

MockDate.set("2021-01-01T08:00:00.000Z");

describe("/account", () => {
  beforeAll(setupIntegration);
  afterAll(resetAll);

  test("GET /devices", async () => {
    const device = await TEST_DEVICE_REPOSITORY.create(await getTestDevice({}));
    const accessToken = generateAccessToken({ deviceId: device.id });

    const response = await request(koa.callback())
      .get("/account/devices")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Device-ID", device.id)
      .expect(200);

    expect(response.body).toStrictEqual({
      devices: [
        {
          id: device.id,
          macAddress: "0025:96FF:FE12:3456",
          name: "My iPhone 12",
          uniqueId: "a097a56f506a4091b4c93a8bfb8cec0f",
        },
      ],
    });
  });
});
