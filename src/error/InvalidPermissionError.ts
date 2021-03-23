import { APIError } from "@lindorm-io/errors";
import { HttpStatus } from "@lindorm-io/core";

export class InvalidPermissionError extends APIError {
  constructor() {
    super("Invalid Permission", {
      statusCode: HttpStatus.ClientError.CONFLICT,
    });
  }
}
