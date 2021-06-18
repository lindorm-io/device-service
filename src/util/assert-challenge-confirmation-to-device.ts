import { ClientError } from "@lindorm-io/errors";
import { Device } from "../entity";
import { IssuerVerifyData } from "@lindorm-io/jwt";
import { stringComparison } from "@lindorm-io/core";

export const assertChallengeConfirmationToDevice = (
  challengeConfirmationToken: IssuerVerifyData<unknown>,
  device: Device,
): void => {
  if (!stringComparison(challengeConfirmationToken.subject, device.accountId)) {
    throw new ClientError("Forbidden", {
      debug: { challengeConfirmationToken },
      statusCode: ClientError.StatusCode.FORBIDDEN,
    });
  }
};
