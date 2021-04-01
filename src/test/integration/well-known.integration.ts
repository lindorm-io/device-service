import MockDate from "mockdate";
import request from "supertest";
import { koa } from "../../server/koa";
import { setupIntegration, TEST_KEY_PAIR_REPOSITORY } from "../grey-box";

MockDate.set("2020-01-01 08:00:00.000");

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

    const [keyPair] = await TEST_KEY_PAIR_REPOSITORY.findMany({});

    expect(response.body).toStrictEqual({
      keys: [
        {
          alg: "ES512",
          c: 1577862000,
          e: "AQAB",
          exp: null,
          kid: keyPair.id,
          kty: "ec",
          n: keyPair.publicKey,
          use: "sig",
        },
      ],
    });
  });
});
