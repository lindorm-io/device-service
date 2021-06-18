import { ClientError } from "@lindorm-io/errors";
import { Device } from "../entity";
import { IssuerVerifyData } from "@lindorm-io/jwt";
import { stringComparison } from "@lindorm-io/core";

export const assertBearerToDevice = (bearerToken: IssuerVerifyData<unknown>, device: Device): void => {
  if (!stringComparison(bearerToken.subject, device.accountId)) {
    throw new ClientError("Forbidden", {
      debug: { bearerToken },
      statusCode: ClientError.StatusCode.FORBIDDEN,
    });
  }
};
