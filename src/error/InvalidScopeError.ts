import { APIError } from "@lindorm-io/errors";
import { HttpStatus } from "@lindorm-io/core";

export class InvalidScopeError extends APIError {
  constructor(scope: string, expect: string) {
    super("Invalid Scope", {
      debug: { scope, expect },
      details: "Expected scope could not be found in scope string",
      publicData: { scope, expect },
      statusCode: HttpStatus.ClientError.BAD_REQUEST,
    });
  }
}
