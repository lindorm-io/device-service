import { APIError, HttpStatus } from "@lindorm-io/core";

export class InvalidDeviceError extends APIError {
  constructor(deviceId: string, error?: Error) {
    super("Invalid Device ID", {
      debug: { id: deviceId, error },
      statusCode: HttpStatus.ClientError.BAD_REQUEST,
    });
  }
}
