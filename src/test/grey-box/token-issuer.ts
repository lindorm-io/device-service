import { Audience } from "../../enum";
import { Permission, Scope } from "@lindorm-io/jwt";
import { TEST_ACCOUNT_ID, TEST_AUTH_TOKEN_ISSUER } from "./setup-integration";

export const generateAccessToken = (): string => {
  const { token } = TEST_AUTH_TOKEN_ISSUER.sign({
    audience: Audience.ACCESS,
    expiry: "2 minutes",
    permission: Permission.USER,
    scope: [Scope.DEFAULT, Scope.EDIT],
    subject: TEST_ACCOUNT_ID,
  });
  return token;
};
