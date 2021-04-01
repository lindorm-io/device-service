import { APIError } from "@lindorm-io/errors";
import { HttpStatus } from "@lindorm-io/core";

export class InvalidChallengeError extends APIError {
  constructor(challengeId: string, error?: Error) {
    super("Invalid Challenge ID", {
      debug: { id: challengeId, error },
      statusCode: HttpStatus.ClientError.BAD_REQUEST,
    });
  }
}
