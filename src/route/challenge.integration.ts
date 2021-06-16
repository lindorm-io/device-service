import MockDate from "mockdate";
import request from "supertest";
import { ChallengeScope, ChallengeStrategy } from "../enum";
import { TEST_DEVICE_REPOSITORY, TEST_CRYPTO_KEY_PAIR, getTestDevice, setupIntegration, resetAll } from "../test";
import { baseHash, getRandomNumber, getRandomValue } from "@lindorm-io/core";
import { koa } from "../server/koa";
import { generateRecoveryKey } from "../util";

MockDate.set("2021-01-01T08:00:00.000Z");

const basicAuth = baseHash("secret:secret");

describe("/challenge", () => {
  beforeAll(setupIntegration);
  afterAll(resetAll);

  test("POST /initialise & /verify - IMPLICIT", async () => {
    const device = await TEST_DEVICE_REPOSITORY.create(await getTestDevice({}));

    const initialiseResponse = await request(koa.callback())
      .post("/challenge/initialise")
      .set("Authorization", `Basic ${basicAuth}`)
      .set("X-Device-ID", device.id)
      .send({
        account_id: device.accountId,
        device_id: device.id,
        scope: ChallengeScope.SIGN_IN,
      })
      .expect(200);

    expect(initialiseResponse.body).toStrictEqual({
      certificate_challenge: expect.any(String),
      challenge_session_token: expect.any(String),
      expires: expect.any(Number),
      expires_in: expect.any(Number),
      strategies: ["implicit", "recovery", "pincode", "secret"],
    });

    const {
      body: { certificate_challenge: certificateChallenge, challenge_session_token: challengeSessionToken },
    } = initialiseResponse;

    const certificateVerifier = TEST_CRYPTO_KEY_PAIR.sign(certificateChallenge);

    const verifyResponse = await request(koa.callback())
      .post("/challenge/verify")
      .set("Authorization", `Basic ${basicAuth}`)
      .set("X-Device-ID", device.id)
      .send({
        certificate_verifier: certificateVerifier,
        challenge_session_token: challengeSessionToken,
        strategy: ChallengeStrategy.IMPLICIT,
      })
      .expect(200);

    expect(verifyResponse.body).toStrictEqual({
      challenge_confirmation_token: expect.any(String),
      expires: 1609488600,
      expires_in: 600,
    });
  });

  test("POST /initialise & /verify - RECOVERY", async () => {
    const recoveryKey = generateRecoveryKey();
    const device = await TEST_DEVICE_REPOSITORY.create(
      await getTestDevice({
        recoveryKey,
      }),
    );

    const initialiseResponse = await request(koa.callback())
      .post("/challenge/initialise")
      .set("Authorization", `Basic ${basicAuth}`)
      .set("X-Device-ID", device.id)
      .send({
        account_id: device.accountId,
        device_id: device.id,
        scope: ChallengeScope.SIGN_IN,
      })
      .expect(200);

    expect(initialiseResponse.body).toStrictEqual({
      certificate_challenge: expect.any(String),
      challenge_session_token: expect.any(String),
      expires: expect.any(Number),
      expires_in: expect.any(Number),
      strategies: ["implicit", "recovery", "pincode", "secret"],
    });

    const {
      body: { certificate_challenge: certificateChallenge, challenge_session_token: challengeSessionToken },
    } = initialiseResponse;

    const certificateVerifier = TEST_CRYPTO_KEY_PAIR.sign(certificateChallenge);

    const verifyResponse = await request(koa.callback())
      .post("/challenge/verify")
      .set("Authorization", `Basic ${basicAuth}`)
      .set("X-Device-ID", device.id)
      .send({
        certificate_verifier: certificateVerifier,
        challenge_session_token: challengeSessionToken,
        strategy: ChallengeStrategy.RECOVERY,
        recovery_key: recoveryKey,
      })
      .expect(200);

    expect(verifyResponse.body).toStrictEqual({
      challenge_confirmation_token: expect.any(String),
      expires: 1609488600,
      expires_in: 600,
    });
  });

  test("POST /initialise & /verify - PINCODE", async () => {
    const pincode = (await getRandomNumber(6)).toString();
    const device = await TEST_DEVICE_REPOSITORY.create(
      await getTestDevice({
        pincode: pincode,
      }),
    );

    const initialiseResponse = await request(koa.callback())
      .post("/challenge/initialise")
      .set("Authorization", `Basic ${basicAuth}`)
      .set("X-Device-ID", device.id)
      .send({
        account_id: device.accountId,
        device_id: device.id,
        scope: ChallengeScope.SIGN_IN,
      })
      .expect(200);

    expect(initialiseResponse.body).toStrictEqual({
      certificate_challenge: expect.any(String),
      challenge_session_token: expect.any(String),
      expires: expect.any(Number),
      expires_in: expect.any(Number),
      strategies: ["implicit", "recovery", "pincode", "secret"],
    });

    const {
      body: { certificate_challenge: certificateChallenge, challenge_session_token: challengeSessionToken },
    } = initialiseResponse;

    const certificateVerifier = TEST_CRYPTO_KEY_PAIR.sign(certificateChallenge);

    const verifyResponse = await request(koa.callback())
      .post("/challenge/verify")
      .set("Authorization", `Basic ${basicAuth}`)
      .set("X-Device-ID", device.id)
      .send({
        certificate_verifier: certificateVerifier,
        challenge_session_token: challengeSessionToken,
        strategy: ChallengeStrategy.PINCODE,
        pincode: pincode,
      })
      .expect(200);

    expect(verifyResponse.body).toStrictEqual({
      challenge_confirmation_token: expect.any(String),
      expires: 1609488600,
      expires_in: 600,
    });
  });

  test("POST /initialise & /verify - SECRET", async () => {
    const secret = getRandomValue(128);
    const device = await TEST_DEVICE_REPOSITORY.create(
      await getTestDevice({
        secret,
      }),
    );

    const initialiseResponse = await request(koa.callback())
      .post("/challenge/initialise")
      .set("Authorization", `Basic ${basicAuth}`)
      .set("X-Device-ID", device.id)
      .send({
        account_id: device.accountId,
        device_id: device.id,
        scope: ChallengeScope.SIGN_IN,
      })
      .expect(200);

    expect(initialiseResponse.body).toStrictEqual({
      certificate_challenge: expect.any(String),
      challenge_session_token: expect.any(String),
      expires: expect.any(Number),
      expires_in: expect.any(Number),
      strategies: ["implicit", "recovery", "pincode", "secret"],
    });

    const {
      body: { certificate_challenge: certificateChallenge, challenge_session_token: challengeSessionToken },
    } = initialiseResponse;

    const certificateVerifier = TEST_CRYPTO_KEY_PAIR.sign(certificateChallenge);

    const verifyResponse = await request(koa.callback())
      .post("/challenge/verify")
      .set("Authorization", `Basic ${basicAuth}`)
      .set("X-Device-ID", device.id)
      .send({
        certificate_verifier: certificateVerifier,
        challenge_session_token: challengeSessionToken,
        strategy: ChallengeStrategy.SECRET,
        secret,
      })
      .expect(200);

    expect(verifyResponse.body).toStrictEqual({
      challenge_confirmation_token: expect.any(String),
      expires: 1609488600,
      expires_in: 600,
    });
  });
});
