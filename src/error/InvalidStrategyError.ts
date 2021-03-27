import { APIError } from "@lindorm-io/errors";
import { HttpStatus } from "@lindorm-io/core";

export class InvalidStrategyError extends APIError {
  constructor(strategy: string, expect: string) {
    super("Invalid Strategy", {
      debug: { strategy, expect },
      details: "Provided strategy does not match the challenge",
      publicData: { strategy, expect },
      statusCode: HttpStatus.ClientError.BAD_REQUEST,
    });
  }
}
