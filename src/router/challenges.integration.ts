import MockDate from "mockdate";
import request from "supertest";
import { ChallengeStrategy } from "../enum";
import { getRandomString } from "@lindorm-io/core";
import { koa } from "../server/koa";
import {
  TEST_CHALLENGE_SESSION_CACHE,
  TEST_DEVICE_REPOSITORY,
  getTestChallengeSession,
  getTestChallengeSessionToken,
  getTestDevice,
  setupIntegration,
  signTestChallenge,
} from "../test";
import { randomUUID } from "crypto";

MockDate.set("2021-01-01T08:00:00.000Z");

describe("/challenges", () => {
  beforeAll(setupIntegration);

  test("POST /", async () => {
    const device = await TEST_DEVICE_REPOSITORY.create(await getTestDevice());

    const response = await request(koa.callback())
      .post("/challenges")
      .set("x-client-id", "a3a90c66-c7b6-4ffe-ba04-c1f9de429f04")
      .set("x-device-id", device.id)
      .send({
        deviceId: device.id,
        identityId: device.identityId,
        nonce: getRandomString(16),
        payload: { integration: true },
        scope: "integration test",
      })
      .expect(200);

    expect(response.body).toStrictEqual({
      certificate_challenge: expect.any(String),
      challenge_session_token: expect.any(String),
      expires_in: 180,
      strategies: ["implicit", "biometry", "pincode"],
    });
  });

  test("POST /:id/confirm [ IMPLICIT ]", async () => {
    const device = await TEST_DEVICE_REPOSITORY.create(await getTestDevice());
    const session = await TEST_CHALLENGE_SESSION_CACHE.create(
      getTestChallengeSession({
        id: randomUUID(),
        deviceId: device.id,
      }),
    );
    const certificateVerifier = signTestChallenge(
      device.certificateMethod,
      session.certificateChallenge,
    );
    const challengeSessionToken = getTestChallengeSessionToken({
      sessionId: session.id,
    });

    const response = await request(koa.callback())
      .post(`/challenges/${session.id}/confirm`)
      .set("x-client-id", "a3a90c66-c7b6-4ffe-ba04-c1f9de429f04")
      .set("x-device-id", device.id)
      .set("x-device-installation-id", device.installationId)
      .set("x-device-unique-id", device.uniqueId)
      .send({
        certificateVerifier,
        challengeSessionToken,
        strategy: ChallengeStrategy.IMPLICIT,
      })
      .expect(200);

    expect(response.body).toStrictEqual({
      challenge_confirmation_token: expect.any(String),
      expires_in: 600,
    });
  });

  test("POST /:id/confirm [ BIOMETRY ]", async () => {
    const device = await TEST_DEVICE_REPOSITORY.create(await getTestDevice());
    const session = await TEST_CHALLENGE_SESSION_CACHE.create(
      getTestChallengeSession({
        id: randomUUID(),
        deviceId: device.id,
      }),
    );
    const certificateVerifier = signTestChallenge(
      device.certificateMethod,
      session.certificateChallenge,
    );
    const challengeSessionToken = getTestChallengeSessionToken({
      sessionId: session.id,
    });

    const response = await request(koa.callback())
      .post(`/challenges/${session.id}/confirm`)
      .set("x-client-id", "a3a90c66-c7b6-4ffe-ba04-c1f9de429f04")
      .set("x-device-id", device.id)
      .set("x-device-installation-id", device.installationId)
      .set("x-device-unique-id", device.uniqueId)
      .send({
        certificateVerifier,
        challengeSessionToken,
        strategy: ChallengeStrategy.BIOMETRY,
        biometry:
          "0KV2dMmKRp9xDHSmtJFsxblPg3xtCCq5n6q3EfrEA1XcYGfI9HPEX9w9GyQ949V3DEgntyGOW07OY2uPROxLd9YAmtFMZgfC0rIg18OdoKBmEa3gpWIvRAZ6J0pjsIHz",
      })
      .expect(200);

    expect(response.body).toStrictEqual({
      challenge_confirmation_token: expect.any(String),
      expires_in: 600,
    });
  });

  test("POST /:id/confirm [ PINCODE ]", async () => {
    const device = await TEST_DEVICE_REPOSITORY.create(await getTestDevice());
    const session = await TEST_CHALLENGE_SESSION_CACHE.create(
      getTestChallengeSession({
        id: randomUUID(),
        deviceId: device.id,
      }),
    );
    const certificateVerifier = signTestChallenge(
      device.certificateMethod,
      session.certificateChallenge,
    );
    const challengeSessionToken = getTestChallengeSessionToken({
      sessionId: session.id,
    });

    const response = await request(koa.callback())
      .post(`/challenges/${session.id}/confirm`)
      .set("x-client-id", "a3a90c66-c7b6-4ffe-ba04-c1f9de429f04")
      .set("x-device-id", device.id)
      .set("x-device-installation-id", device.installationId)
      .set("x-device-unique-id", device.uniqueId)
      .send({
        certificateVerifier,
        challengeSessionToken,
        strategy: ChallengeStrategy.PINCODE,
        pincode: "123456",
      })
      .expect(200);

    expect(response.body).toStrictEqual({
      challenge_confirmation_token: expect.any(String),
      expires_in: 600,
    });
  });

  test("POST /:id/reject", async () => {
    const device = await TEST_DEVICE_REPOSITORY.create(await getTestDevice());
    const session = await TEST_CHALLENGE_SESSION_CACHE.create(
      getTestChallengeSession({
        id: randomUUID(),
        deviceId: device.id,
      }),
    );
    const challengeSessionToken = getTestChallengeSessionToken({
      sessionId: session.id,
    });

    await request(koa.callback())
      .post(`/challenges/${session.id}/reject`)
      .set("x-client-id", "a3a90c66-c7b6-4ffe-ba04-c1f9de429f04")
      .set("x-device-id", device.id)
      .set("x-device-installation-id", device.installationId)
      .set("x-device-unique-id", device.uniqueId)
      .send({
        challengeSessionToken,
      })
      .expect(200);
  });
});
