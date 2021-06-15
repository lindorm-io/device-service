import { ChallengeScope } from "../enum";
import { ClientError } from "@lindorm-io/errors";
import { Device } from "../entity";
import { IssuerVerifyData } from "@lindorm-io/jwt";
import { includes } from "lodash";
import { stringComparison } from "@lindorm-io/core";

export const assertChallengeConfirmationToDevice = (
  challengeConfirmationToken: IssuerVerifyData<unknown>,
  device: Device,
): void => {
  if (!includes(challengeConfirmationToken.scope, ChallengeScope.CHANGE)) {
    throw new ClientError("Forbidden", {
      debug: { challengeConfirmationToken },
      statusCode: ClientError.StatusCode.FORBIDDEN,
    });
  }

  if (!stringComparison(challengeConfirmationToken.subject, device.accountId)) {
    throw new ClientError("Forbidden", {
      debug: { challengeConfirmationToken },
      statusCode: ClientError.StatusCode.FORBIDDEN,
    });
  }
};
