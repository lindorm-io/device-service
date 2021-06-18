import { Audience } from "../enum";
import { Keystore } from "@lindorm-io/key-pair";
import { Scope } from "../enum";
import { TokenIssuer } from "@lindorm-io/jwt";
import { config } from "../config";
import { getTestKeyPairEC } from "./test-key-pair";
import { logger } from "./test-logger";

export const generateAccessToken = ({
  accountId = "51cc7c03-3f86-44ae-8be2-5fcf5536c08b",
  clientId = "5c63ca22-6617-45eb-9005-7c897a25d375",
  deviceId = "d9b9adec-81fa-4ea0-8cf3-44ccd4fe5162",
}: {
  accountId?: string;
  clientId?: string;
  deviceId?: string;
}): string => {
  const issuer = new TokenIssuer({
    issuer: config.AUTH_JWT_ISSUER,
    keystore: new Keystore({ keys: [getTestKeyPairEC()] }),
    logger,
  });
  const { token } = issuer.sign({
    audience: "access",
    clientId,
    deviceId,
    expiry: "2 minutes",
    permission: "user",
    scope: [Scope.DEFAULT, Scope.EDIT],
    subject: accountId,
  });
  return token;
};

export const generateChallengeConfirmationToken = ({
  accountId = "51cc7c03-3f86-44ae-8be2-5fcf5536c08b",
  clientId = "5c63ca22-6617-45eb-9005-7c897a25d375",
  deviceId = "d9b9adec-81fa-4ea0-8cf3-44ccd4fe5162",
}: {
  accountId?: string;
  clientId?: string;
  deviceId?: string;
}): string => {
  const issuer = new TokenIssuer({
    issuer: config.DEVICE_JWT_ISSUER,
    keystore: new Keystore({ keys: [getTestKeyPairEC()] }),
    logger,
  });
  const { token } = issuer.sign({
    audience: Audience.CHALLENGE_CONFIRMATION,
    clientId,
    deviceId,
    expiry: "2 minutes",
    scope: ["change"],
    subject: accountId,
  });
  return token;
};
