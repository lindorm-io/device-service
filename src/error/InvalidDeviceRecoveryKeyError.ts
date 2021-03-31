import { APIError } from "@lindorm-io/errors";
import { HttpStatus } from "@lindorm-io/core";

export class InvalidDeviceRecoveryKeyError extends APIError {
  constructor(deviceId: string, error?: Error) {
    super("Invalid Device Recovery Key", {
      debug: { id: deviceId, error },
      statusCode: HttpStatus.ClientError.CONFLICT,
    });
  }
}
