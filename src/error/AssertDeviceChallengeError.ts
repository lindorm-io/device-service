import { APIError } from "@lindorm-io/errors";
import { HttpStatus } from "@lindorm-io/core";

export class AssertDeviceChallengeError extends APIError {
  constructor(challenge: string, verifier: string) {
    super("Invalid Device Challenge", {
      debug: { challenge, verifier },
      statusCode: HttpStatus.ClientError.FORBIDDEN,
    });
  }
}
