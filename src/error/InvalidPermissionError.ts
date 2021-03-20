import { APIError, HttpStatus } from "@lindorm-io/core";

export class InvalidPermissionError extends APIError {
  constructor() {
    super("Invalid Permission", {
      statusCode: HttpStatus.ClientError.CONFLICT,
    });
  }
}
