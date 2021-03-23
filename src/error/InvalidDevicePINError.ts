import { APIError } from "@lindorm-io/errors";
import { HttpStatus } from "@lindorm-io/core";

export class InvalidDevicePINError extends APIError {
  constructor(deviceId: string, error?: Error) {
    super("Invalid Device PIN", {
      debug: { id: deviceId, error },
      statusCode: HttpStatus.ClientError.CONFLICT,
    });
  }
}
