import MockDate from "mockdate";
import request from "supertest";
import { koa } from "../../server/koa";
import { setupIntegration } from "../grey-box";

MockDate.set("2021-01-01T08:00:00.000Z");

describe("/.well-known", () => {
  beforeAll(async () => {
    await setupIntegration();
    koa.load();
  });

  test("GET /jwks.json", async () => {
    const response = await request(koa.callback())
      .get(`/.well-known/jwks.json`)
      .set("X-Client-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .set("X-Correlation-ID", "5c63ca22-6617-45eb-9005-7c897a25d375")
      .expect(200);

    expect(response.body).toStrictEqual({
      keys: [
        {
          alg: "ES512",
          allowed_from: 1577865600000,
          created_at: 1577865600000,
          crv: "P-521",
          key_ops: ["sign", "verify"],
          kid: "7531da89-12e9-403e-925a-5da49100635c",
          kty: "EC",
          use: "sig",
          x: "AHxwF8PAKLjUbiRVbhXdjzqcgwwLKljN87yBiOlLT3WXGQyChNFLcszWnrkpB/AGiWtYh1Wtts4gsBJ/Tp9CwfDm",
          y: "AS3iydW4wE74tLql6xf28DxBPUuNfvlerYiectjVVOh42bGS4z6gNmCoc5jDN9SG77NloDkC4SSo+LjtMD2IJJhV",
        },
      ],
    });
  });
});
