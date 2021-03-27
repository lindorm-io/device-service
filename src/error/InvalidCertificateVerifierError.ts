import { APIError } from "@lindorm-io/errors";
import { HttpStatus } from "@lindorm-io/core";

export class InvalidCertificateVerifierError extends APIError {
  constructor(challenge: string, verifier: string) {
    super("Invalid Certificate Challenge Verifier", {
      debug: { challenge, verifier },
      statusCode: HttpStatus.ClientError.FORBIDDEN,
    });
  }
}
