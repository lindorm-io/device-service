import { ClientError } from "@lindorm-io/errors";
import { Device } from "../entity";
import { IssuerVerifyData, Scope } from "@lindorm-io/jwt";
import { includes } from "lodash";
import { stringComparison } from "@lindorm-io/core";

export const assertBearerToDevice = (bearerToken: IssuerVerifyData<unknown>, device: Device): void => {
  if (!includes(bearerToken.scope, Scope.DEFAULT)) {
    throw new ClientError("Forbidden", {
      debug: { bearerToken },
      statusCode: ClientError.StatusCode.FORBIDDEN,
    });
  }

  if (!stringComparison(bearerToken.subject, device.accountId)) {
    throw new ClientError("Forbidden", {
      debug: { bearerToken },
      statusCode: ClientError.StatusCode.FORBIDDEN,
    });
  }
};
