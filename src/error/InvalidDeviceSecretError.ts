import { APIError, HttpStatus } from "@lindorm-io/core";

export class InvalidDeviceSecretError extends APIError {
  constructor(deviceId: string, error?: Error) {
    super("Invalid Device Secret", {
      debug: { id: deviceId, error },
      statusCode: HttpStatus.ClientError.CONFLICT,
    });
  }
}
