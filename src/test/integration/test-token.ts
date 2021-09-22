import { IssuerSignOptions } from "@lindorm-io/jwt";
import { ChallengeStrategy, TokenType } from "../../enum";
import { getTestDeviceJwt, getTestJwt } from "./test-jwt";
import { config } from "../../config";
import { getRandomString } from "@lindorm-io/core";

export const getTestAccessToken = (
  options: Partial<IssuerSignOptions<any, any>> = {},
): string => {
  const jwt = getTestJwt();
  const { token } = jwt.sign({
    id: "a7534836-65f2-4e04-9f16-b5afebdcdd71",
    audiences: ["0438487d-0cf0-4399-b3d3-c2876db14ca6"],
    authMethodsReference: ["email"],
    expiry: "10 seconds",
    scopes: ["test"],
    subject: "b799b044-16db-495a-b7e1-2cf3175d4b54",
    subjectHint: "identity",
    type: "access_token",
    ...options,
  });
  return token;
};

export const getTestChallengeConfirmationToken = (
  options: Partial<IssuerSignOptions<any, any>> = {},
): string => {
  const jwt = getTestDeviceJwt();
  const { token } = jwt.sign({
    audiences: ["a3a90c66-c7b6-4ffe-ba04-c1f9de429f04"],
    claims: {
      deviceId: "id",
      strategy: ChallengeStrategy.PINCODE,
      ...(options.claims || {}),
    },
    expiry: config.EXPIRY_CHALLENGE_CONFIRMATION_TOKEN,
    nonce: getRandomString(16),
    payload: { generated: true },
    scopes: ["test"],
    sessionId: "id",
    subject: "b799b044-16db-495a-b7e1-2cf3175d4b54",
    subjectHint: "identity",
    type: TokenType.CHALLENGE_CONFIRMATION_TOKEN,
    ...options,
  });
  return token;
};

export const getTestChallengeSessionToken = (
  options: Partial<IssuerSignOptions<any, any>> = {},
): string => {
  const jwt = getTestDeviceJwt();
  const { token } = jwt.sign({
    audiences: ["a3a90c66-c7b6-4ffe-ba04-c1f9de429f04"],
    expiry: config.EXPIRY_CHALLENGE_SESSION,
    sessionId: "id",
    subject: "b799b044-16db-495a-b7e1-2cf3175d4b54",
    subjectHint: "identity",
    type: TokenType.CHALLENGE_SESSION_TOKEN,
    ...options,
  });
  return token;
};

export const getTestEnrolmentSessionToken = (
  options: Partial<IssuerSignOptions<any, any>> = {},
): string => {
  const jwt = getTestDeviceJwt();
  const { token } = jwt.sign({
    audiences: ["a3a90c66-c7b6-4ffe-ba04-c1f9de429f04"],
    expiry: config.EXPIRY_ENROLMENT_SESSION,
    sessionId: "id",
    subject: "b799b044-16db-495a-b7e1-2cf3175d4b54",
    subjectHint: "identity",
    type: TokenType.ENROLMENT_SESSION_TOKEN,
    ...options,
  });
  return token;
};
