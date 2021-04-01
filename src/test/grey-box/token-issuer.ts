import { Audience, ChallengeScope } from "../../enum";
import { Permission, Scope } from "@lindorm-io/jwt";
import { TEST_ACCOUNT_ID, TEST_AUTH_TOKEN_ISSUER, TEST_DEVICE_TOKEN_ISSUER } from "./setup-integration";

export const generateAccessToken = ({
  clientId = "5c63ca22-6617-45eb-9005-7c897a25d375",
  deviceId = "d9b9adec-81fa-4ea0-8cf3-44ccd4fe5162",
}: {
  clientId?: string;
  deviceId?: string;
}): string => {
  const { token } = TEST_AUTH_TOKEN_ISSUER.sign({
    audience: Audience.ACCESS,
    clientId,
    deviceId,
    expiry: "2 minutes",
    permission: Permission.USER,
    scope: [Scope.DEFAULT, Scope.EDIT],
    subject: TEST_ACCOUNT_ID,
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
  const { token } = TEST_DEVICE_TOKEN_ISSUER.sign({
    audience: Audience.CHALLENGE_CONFIRMATION,
    clientId,
    deviceId,
    expiry: "2 minutes",
    scope: [ChallengeScope.CHANGE],
    subject: accountId,
  });
  return token;
};
