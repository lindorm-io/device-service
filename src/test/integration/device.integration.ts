import MockDate from "mockdate";
import request from "supertest";
import { Audience } from "../../enum";
import { Device } from "../../entity";
import { Permission, Scope } from "@lindorm-io/jwt";
import { RepositoryEntityNotFoundError } from "@lindorm-io/mongo";
import { TEST_ACCOUNT_ID, TEST_DEVICE_REPOSITORY, TEST_ISSUER, setupIntegration, getGreyBoxDevice } from "../grey-box";
import { TEST_KEY_PAIR_RSA } from "../grey-box/key-pair";
import { koa } from "../../server/koa";

MockDate.set("2020-01-01 08:00:00.000");

describe("/device", () => {
  let accessToken: string;
  let device: Device;

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
  });

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

  test("POST /", async () => {
    const response = await request(koa.callback())
      .post("/device")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        name: "new-device-name",
        pin: "654321",
        public_key: TEST_KEY_PAIR_RSA.publicKey,
        secret: "test_device_secret",
      })
      .expect(201);

    expect(response.body).toStrictEqual({
      device_id: expect.any(String),
    });

    const result = await TEST_DEVICE_REPOSITORY.find({ id: response.body.device_id });
    expect(result.name).toBe("new-device-name");
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
    const oldSignature = device.secret;

    await request(koa.callback())
      .patch(`/device/${device.id}/secret`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .send({
        pin: "123456",
        updatedSecret: "test_device_secret",
      })
      .expect(204);

    const result = await TEST_DEVICE_REPOSITORY.find({ id: device.id });
    expect(result.secret).not.toBe(oldSignature);
  });
});
