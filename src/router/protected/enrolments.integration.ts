import MockDate from "mockdate";
import request from "supertest";
import { CertificateMethod } from "../../enum";
import { koa } from "../../server/koa";
import { v4 as uuid } from "uuid";
import {
  getTestAccessToken,
  getTestEnrolmentSession,
  getTestEnrolmentSessionToken,
  setupIntegration,
  signTestChallenge,
  TEST_ENROLMENT_SESSION_CACHE,
} from "../../test";
import { getRandomNumber, getRandomValue } from "@lindorm-io/core";

MockDate.set("2021-01-01T08:00:00.000Z");

describe("/protected/enrolments", () => {
  beforeAll(setupIntegration);

  test("POST /", async () => {
    const accessToken = getTestAccessToken();

    const response = await request(koa.callback())
      .post("/protected/enrolments")
      .set("Authorization", `Bearer ${accessToken}`)
      .set("x-client-id", "a3a90c66-c7b6-4ffe-ba04-c1f9de429f04")
      .set("x-device-installation-id", "12be09f5-fcd4-438f-9b5d-dc1fb11e5e75")
      .set("x-device-name", "Test Device Name")
      .set("x-device-unique-id", "27a10522a6994bbca0e1fc666804b350")
      .send({
        certificateMethod: CertificateMethod.SHA384,
        macAddress: "4A:E2:BD:16:8F:5A",
        publicKey:
          "-----BEGIN RSA PUBLIC KEY-----\n" +
          "MIGJAoGBAKdVz2lIbQi1YU3Z0qRizpV9gAMW9Kmwms4aP+r7CKcu4w9/fMcV4v6P\n" +
          "zYHwnjvTEZ6gSqtxcpwT6EgBAgxFolqjeInOis2I+tcfxcShwcfMZ/E7kgktP15w\n" +
          "dsAFDTzmso9VtnBNgbt8afNea1nK25Fa+Zq+gztxkI5pkw1WFm4FAgMBAAE=\n" +
          "-----END RSA PUBLIC KEY-----\n",
      })
      .expect(200);

    expect(response.body).toStrictEqual({
      certificate_challenge: expect.any(String),
      enrolment_session_token: expect.any(String),
      expires_in: 180,
    });
  });

  test("POST /:id/confirm", async () => {
    const session = await TEST_ENROLMENT_SESSION_CACHE.create(
      getTestEnrolmentSession({
        id: uuid(),
      }),
    );
    const certificateVerifier = signTestChallenge(
      session.certificateMethod,
      session.certificateChallenge,
    );
    const enrolmentSessionToken = getTestEnrolmentSessionToken({
      sessionId: session.id,
    });
    const accessToken = getTestAccessToken();

    const response = await request(koa.callback())
      .post(`/protected/enrolments/${session.id}/confirm`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("x-client-id", "a3a90c66-c7b6-4ffe-ba04-c1f9de429f04")
      .set("x-device-installation-id", "12be09f5-fcd4-438f-9b5d-dc1fb11e5e75")
      .set("x-device-name", "Test Device Name")
      .set("x-device-unique-id", "27a10522a6994bbca0e1fc666804b350")
      .send({
        certificateVerifier,
        enrolmentSessionToken,
        biometry: getRandomValue(128),
        pincode: (await getRandomNumber(6)).toString(),
      })
      .expect(200);

    expect(response.body).toStrictEqual({
      challenge_confirmation_token: expect.any(String),
      device_id: expect.any(String),
      expires_in: 600,
    });
  });

  test("POST /:id/reject", async () => {
    const session = await TEST_ENROLMENT_SESSION_CACHE.create(
      getTestEnrolmentSession({
        id: uuid(),
      }),
    );
    const enrolmentSessionToken = getTestEnrolmentSessionToken({
      sessionId: session.id,
    });
    const accessToken = getTestAccessToken();

    await request(koa.callback())
      .post(`/protected/enrolments/${session.id}/reject`)
      .set("Authorization", `Bearer ${accessToken}`)
      .set("x-client-id", "a3a90c66-c7b6-4ffe-ba04-c1f9de429f04")
      .set("x-device-installation-id", "12be09f5-fcd4-438f-9b5d-dc1fb11e5e75")
      .set("x-device-name", "Test Device Name")
      .set("x-device-unique-id", "27a10522a6994bbca0e1fc666804b350")
      .send({
        enrolmentSessionToken,
      })
      .expect(200);
  });
});
