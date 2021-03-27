import { APIError } from "@lindorm-io/errors";
import { Challenge } from "../entity";
import { HttpStatus } from "@lindorm-io/core";

export class ExpiredChallengeError extends APIError {
  constructor(challenge: Challenge) {
    super("Challenge Session is expired", {
      debug: {
        id: challenge.id,
        expires: challenge.expires,
      },
      statusCode: HttpStatus.ClientError.UNAUTHORIZED,
    });
  }
}
